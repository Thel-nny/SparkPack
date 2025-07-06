import { prisma } from "../src/lib/prisma";

async function main() {
  try {
    const users = await prisma.user.findMany({
      include: {
        clientDetails: true,
      },
    });

    console.log("User Data:");
    users.forEach((user) => {
      console.log({
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNum: user.phoneNum,
        role: user.role,
        clientDetails: user.clientDetails,
      });
    });
  } catch (error) {
    console.error("Error fetching user data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
