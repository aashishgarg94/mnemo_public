import logging
from typing import List
import json
from fastapi import HTTPException
from master.utils.constants import REQUEST_LIMIT, REQUEST_SKIP_DEFAULT
from .mongodb import get_collection
from pymongo import ReturnDocument, GEOSPHERE


# Keeping is static for exceptional cases where we might need to transform the data explicitly
def return_id_transformation(extended_class_model, result):
    try:
        logging.info(f"Post flight operations. Performing transformations now...")
        is_list_type = isinstance(result, list)
        if is_list_type:
            data_list = []
            for document in result:
                data = extended_class_model.from_mongo(data=document)
                data_list.append(data)
            return data_list
        else:
            data = extended_class_model.from_mongo(data=result) if result else None
            return data
    except Exception as e:
        raise e


class MongoBase:
    def __init__(self, collection_name: str = None):
        self.collection_name = collection_name

    def __call__(self, collection_name: str = None):
        if collection_name is not None:
            self.collection_name = collection_name

        # check if collection name still None
        if self.collection_name is None:
            raise HTTPException(
                status_code=500,
                detail=f"Mongo base: Not callable. DB collection is not passed.",
            )
        try:
            self.collection = get_collection(self.collection_name)
        except Exception as e:
            raise e

    @staticmethod
    def pre_flight_check(return_doc_id=False, extended_class_model=None):
        if return_doc_id and extended_class_model is None:
            raise ValueError(
                f"return_doc_id set to True. extended_class_model is required now"
            )
        elif not return_doc_id and extended_class_model is not None:
            raise ValueError(f"api model is provided, please set return_doc_id to True")
        elif return_doc_id and extended_class_model is not None:
            logging.info(
                f"Transformation required, will be performed on data in post flight operations..."
            )
        else:
            logging.info(f"Transformation not required, will skip it...")

    async def insert_one(
        self, document: dict, return_doc_id=False, extended_class_model=None
    ):
        try:
            self.pre_flight_check(return_doc_id, extended_class_model)
        except Exception as e:
            raise e
        try:
            result = await self.collection.insert_one(document)
            return result.inserted_id
        except Exception as e:
            # logging.error(
            #     f"Mongo base: Error while fetching one from collection. Error: {e}"
            # )
            raise e
    
    async def insert_many(
        self, document: list, return_doc_id=False, extended_class_model=None
    ):
        try:
            self.pre_flight_check(return_doc_id, extended_class_model)
        except Exception as e:
            raise e
        try:
            result = await self.collection.insert_many(document, ordered=False)
            return True if result else False
        except Exception as e:
            logging.error(
                f"Mongo base: Error while inserting many. Error: {e}"
            )
            raise e

    async def find_one(
        self, finder: dict, return_doc_id=False, extended_class_model=None
    ):
        try:
            self.pre_flight_check(return_doc_id, extended_class_model)
        except Exception as e:
            raise e
        try:
            result = await self.collection.find_one(finder)
            if return_doc_id:
                transformed_result = return_id_transformation(
                    extended_class_model=extended_class_model, result=result
                )
                return transformed_result
            return result
        except Exception as e:
            logging.error(
                f"Mongo base: Error while fetching one from collection. Error: {e}"
            )
            raise e

    async def find_one_and_modify(
        self,
        find: dict,
        update: dict,
        sort: list = None,
        return_updated_document: bool = True,
        return_doc_id=False,
        extended_class_model=None,
        insert_if_not_found: bool = False,
        array_filters=None,
    ):
        try:
            self.pre_flight_check(return_doc_id, extended_class_model)
        except Exception as e:
            raise e
        try:
            if sort:
                result = await self.collection.find_one_and_update(
                    find,
                    update,
                    sort=sort,
                    return_document=ReturnDocument.AFTER
                    if return_updated_document
                    else ReturnDocument.BEFORE,
                    upsert=insert_if_not_found,
                    array_filters=array_filters,
                )
            else:
                result = await self.collection.find_one_and_update(
                    find,
                    update,
                    return_document=ReturnDocument.AFTER
                    if return_updated_document
                    else ReturnDocument.BEFORE,
                    upsert=insert_if_not_found,
                    array_filters=array_filters,
                )
            if return_doc_id:
                transformed_result = return_id_transformation(
                    extended_class_model=extended_class_model, result=result
                )
                return transformed_result
            return result
        except Exception as e:
            logging.error(
                f"Mongo base: Error while updating one in collection. Error: {e}"
            )
            raise e

    async def find(
        self,
        finder: dict,
        projection: dict = None,
        return_doc_id=False,
        extended_class_model=None,
        sort: list = None,
        skip: int = REQUEST_SKIP_DEFAULT,
        limit: int = REQUEST_LIMIT,
        only_list_without_id: bool = False,
    ):
        try:
            self.pre_flight_check(return_doc_id, extended_class_model)
            if only_list_without_id:
                logging.warning(
                    f"only_list_without_id is provided, return_doc_id and extended_class_model will be skipped"
                )
        except Exception as e:
            raise e
        try:
            if sort:
                result = (
                    self.collection.find(filter=finder, projection=projection)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                )
            else:
                result = (
                    self.collection.find(filter=finder, projection=projection)
                        .skip(skip)
                        .limit(limit)
                )
            result_list = []
            if only_list_without_id:
                for document in await result.to_list(length=limit):
                    del document["_id"]
                    result_list.append(document)
            else:
                for document in await result.to_list(length=limit):
                    result_list.append(document)
                if return_doc_id:
                    transformed_result = return_id_transformation(
                        extended_class_model=extended_class_model, result=result_list
                    )
                    return transformed_result
            return result_list
        except Exception as e:
            logging.error(
                f"Mongo base: Error while fetching one from collection. Error: {e}"
            )
            raise e

    async def count(
        self,
        filter_condition: dict,
    ):
        try:
            return await self.collection.count_documents(filter=filter_condition)
        except Exception as e:
            logging.error(
                f"Mongo base: Error while counting from collection. Error: {e}"
            )
            raise e

    async def aggregate(self, condition: List):
        try:
            result = await self.collection.aggregate(condition).to_list(length=None)
            # for document in await result.to_list(length=10):
                # logging.info(document, "===")

            return result
        except Exception as e:
            logging.error(f"Mongo base: Error while aggregating. Error {e}")
            raise e

    async def aggregate_get_count(self, condition: List):
        try:
            result = self.collection.aggregate(condition)
            result_aggregate_count = 0
            for document in await result.to_list(length=100):
                result_aggregate_count = document.get("aggregate_sum")
            return result_aggregate_count
        except Exception as e:
            logging.error(f"Mongo base: Error while aggregating. Error {e}")
            raise e

    async def modify_many(
        self,
        find: dict,
        update: dict,
        insert_if_not_found: bool = False,
        array_filters: list = None,
        hint: list = None,
        bypass_document_validation: bool = False
    ):
        try:
            result = await self.collection.update_many(
                filter = find, 
                update = update,
                upsert = insert_if_not_found,
                bypass_document_validation = bypass_document_validation,
                array_filters = array_filters,
                hint = hint
            )
            return result
        except Exception as e:
            logging.error(
                f"Mongo base: Error while updating one in collection. Error: {e}"
            )
            raise e
        

    async def create_geo_index(
        self
    ):
        try:
            result  = await self.collection.create_index([("loc", GEOSPHERE )])
            return result
        except Exception as e:
            logging.error(
                f"Mongo base: Error while updating one in collection. Error: {e}"
            )
            raise e

    async def delete_one(
        self,
        finder: dict,
    ): 
        try:
            result = await self.collection.delete_one(finder)
            return result
        except Exception as e:
            logging.error(
                f"Mongo base: Error while updating one in collection. Error: {e}"
            )
            raise e