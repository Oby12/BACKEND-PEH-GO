// seed.js
import { prismaClient } from "./application/database.js";

async function seedCategories() {
    const categories = [
        { name: "Destination" },
        { name: "Hotel" },
        { name: "Transportation" },
        { name: "Culinary" },
        { name: "Mall" },
        { name: "Souvenir" }
    ];

    console.log("Mulai seeding kategori...");

    for (const category of categories) {
        await prismaClient.category.upsert({
            where: { name: category.name },
            update: {},
            create: { name: category.name }
        });
        console.log(`Kategori "${category.name}" telah ditambahkan.`);
    }

    console.log("Seeding kategori selesai!");
    return "Seeding completed";
}

// Eksekusi fungsi seeder
seedCategories()
    .then(console.log)
    .catch(e => {
        console.error("Error saat seeding:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prismaClient.$disconnect();
    });