import os
from fastapi import HTTPException
from gensim.models import KeyedVectors
import gensim.downloader as api


class Word2VecModel:
    def __init__(self, model_path=None):
        """
        Initialize the Word2Vec model, ensuring compatibility for both Docker and local runs.
        """
        try:
            # Default to a writable path for local runs
            if model_path is None:
                model_path = (
                    "/app/models/glove-wiki-gigaword-100"
                    if os.getenv("DOCKER_ENV")  # Check for Docker environment variable
                    else os.path.expanduser("~/.word2vec_models/glove-wiki-gigaword-100")
                )

            # If the file does not exist, download and save the model
            if not os.path.isfile(model_path + ".kv"):
                print(f"Model not found at {model_path}. Downloading Word2Vec model...")
                os.makedirs(os.path.dirname(model_path), exist_ok=True)
                model = api.load("glove-wiki-gigaword-100")
                model.save(model_path + ".kv")
                print(f"Word2Vec model downloaded and saved to {model_path}.kv")

            # Load the model
            print(f"Loading Word2Vec model from {model_path}.kv")
            self.model = KeyedVectors.load(model_path + ".kv", mmap='r')
            print("Word2Vec model loaded successfully!")
        except Exception as e:
            error_msg = f"Error loading Word2Vec model from {model_path}: {str(e)}"
            print(f"ERROR: {error_msg}")
            raise HTTPException(status_code=500, detail=error_msg)

    def closest_words(self, clue: str, word_pool: list, top_n: int = 3) -> list:
        """
        Find the closest words from the word pool to the given clue.
        """
        try:
            # Ensure words in the pool are in the model vocabulary
            filtered_pool = [word for word in word_pool if word in self.model.key_to_index]

            # Compute similarities
            similarities = [
                (word, self.model.similarity(clue, word))
                for word in filtered_pool
                if clue in self.model.key_to_index
            ]

            # Sort by similarity and return the top_n words
            closest = sorted(similarities, key=lambda x: x[1], reverse=True)[:top_n]
            return [word for word, similarity in closest]
        except KeyError:
            raise HTTPException(status_code=400, detail=f"The word '{clue}' is not in the Word2Vec vocabulary.")