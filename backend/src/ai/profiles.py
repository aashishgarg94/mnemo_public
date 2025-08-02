from dataclasses import dataclass

class DatabaseConn:
    """This is a fake database for example purposes.

    In reality, you'd be connecting to an external database
    (e.g. PostgreSQL) to get information about player.
    """

    @classmethod
    async def player_name(cls, *, id: int) -> str | None:
        if id == 111:
            return 'Aashish'
        elif id == 112:
            return 'Pratishtha'
        elif id == 113:
            return 'Abhishek'
        return ''

@dataclass
class SupportDependencies:
    player_id: int
    db: DatabaseConn