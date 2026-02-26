from prisma import Prisma
import logging

logger = logging.getLogger(__name__)

class Database:
    def __init__(self):
        self.client = Prisma()

    async def connect(self):
        if not self.client.is_connected():
            await self.client.connect()
            logger.info("Connected to database")

    async def disconnect(self):
        if self.client.is_connected():
            await self.client.disconnect()
            logger.info("Disconnected from database")

db = Database()
