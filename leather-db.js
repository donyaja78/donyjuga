// Leather Database
const leatherDB = {
    cow: {
        name: "Cow Leather",
        quality: "Premium",
        thickness: "1.2-1.4mm",
        durability: "High",
        products: [
            { name: "Belts", icon: "fa-bolt", difficulty: "Easy", time: "2-4h" },
            { name: "Wallets", icon: "fa-wallet", difficulty: "Medium", time: "4-6h" },
            { name: "Bags", icon: "fa-shopping-bag", difficulty: "Hard", time: "8-12h" },
            { name: "Jackets", icon: "fa-vest", difficulty: "Expert", time: "12-24h" }
        ],
        characteristics: "Thick, durable, perfect for heavy-duty items"
    },
    goat: {
        name: "Goat Skin",
        quality: "Fine",
        thickness: "0.8-1.0mm",
        durability: "Medium",
        products: [
            { name: "Gloves", icon: "fa-hand-paper", difficulty: "Medium", time: "3-5h" },
            { name: "Pouches", icon: "fa-bag-shopping", difficulty: "Easy", time: "2-3h" },
            { name: "Book Covers", icon: "fa-book", difficulty: "Easy", time: "1-2h" },
            { name: "Phone Cases", icon: "fa-mobile", difficulty: "Medium", time: "2-4h" }
        ],
        characteristics: "Soft, fine grain, excellent for delicate items"
    },
    sheep: {
        name: "Sheepskin",
        quality: "Luxury",
        thickness: "1.0-1.2mm",
        durability: "Medium-High",
        products: [
            { name: "Slippers", icon: "fa-shoe-prints", difficulty: "Medium", time: "3-5h" },
            { name: "Cushions", icon: "fa-couch", difficulty: "Easy", time: "2-3h" },
            { name: "Vests", icon: "fa-vest", difficulty: "Hard", time: "6-10h" },
            { name: "Decoration", icon: "fa-palette", difficulty: "Easy", time: "1-3h" }
        ],
        characteristics: "Warm, lightweight, perfect for clothing"
    },
    exotic: {
        name: "Exotic Leather",
        quality: "Unique",
        thickness: "Varies",
        durability: "High",
        products: [
            { name: "Luxury Bags", icon: "fa-suitcase", difficulty: "Expert", time: "15-30h" },
            { name: "Watch Straps", icon: "fa-clock", difficulty: "Medium", time: "2-3h" },
            { name: "Art Pieces", icon: "fa-palette", difficulty: "Easy", time: "1-4h" },
            { name: "Keychains", icon: "fa-key", difficulty: "Easy", time: "1-2h" }
        ],
        characteristics: "Unique patterns, high value, specialty applications"
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { leatherDB };
}