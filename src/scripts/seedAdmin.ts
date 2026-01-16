import { prisma } from "../lib/prisma";
import { UserRoles } from "../Middleware/auth";

async function seedAdmin() {
  try {
    const adminData = {
      name: "admin 3",
      email: "admin 3@gmail.com",
      role: UserRoles.ADMIN,
      password: "admin12345",
    };
    const existingUsers = await prisma.user.findUnique({
      where: {
        email: adminData.email,
      },
    });

    if (existingUsers) {
      throw new Error("Admin user already exists");
    }
    const signUpAdmin = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        name: adminData.name,
        email: adminData.email,
        role: UserRoles.ADMIN,
      },
    });
    // const signUpAdmin = await fetch(
    //   "http://localhost:5000/api/auth/sign-up/email",
    //   {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     method: "POST",
    //     body: JSON.stringify(adminData),
    //   }
    // );
    console.log(signUpAdmin);

    if (signUpAdmin) {
      console.log("admin created!!");
      await prisma.user.update({
        where: {
          email: adminData.email,
        },
        data: {
          emailVerified: true,
        },
      });
      console.log("email verification updated!!");
    }
    console.log("Success!!");
  } catch (error) {
    console.error("Error seeding admin user:", error);
  }
}

seedAdmin();
