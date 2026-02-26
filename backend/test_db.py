import asyncio
from prisma import Prisma

async def main():
    db = Prisma()
    await db.connect()
    try:
        # Try to find many to check if table exists
        await db.employee.find_many()
        print("Table 'employee' exists and is accessible.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        await db.disconnect()

if __name__ == "__main__":
    asyncio.run(main())
