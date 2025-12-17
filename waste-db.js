// Waste Materials Database
const wasteDB = {
    plastic: {
        name: "Plastic Bottle",
        type: "plastic",
        recyclability: "Highly Recyclable",
        transformations: [
            { name: "Polyester Fiber", icon: "fa-tshirt", desc: "Clothing material" },
            { name: "New Bottles", icon: "fa-wine-bottle", desc: "Food containers" },
            { name: "Furniture", icon: "fa-chair", desc: "Outdoor furniture" },
            { name: "Construction", icon: "fa-home", desc: "Building materials" }
        ],
        process: "Collection → Sorting → Shredding → Washing → Melting",
        impact: { co2: "-2.3kg", water: "+150L", energy: "+45kWh" }
    },
    paper: {
        name: "Cardboard Box",
        type: "paper",
        recyclability: "Recyclable",
        transformations: [
            { name: "New Cardboard", icon: "fa-box", desc: "Packaging material" },
            { name: "Paper Towels", icon: "fa-hand-sparkles", desc: "Absorbent paper" },
            { name: "Egg Cartons", icon: "fa-egg", desc: "Food packaging" },
            { name: "Paper Bags", icon: "fa-shopping-bag", desc: "Shopping bags" }
        ],
        process: "Collection → Pulping → Screening → De-inking",
        impact: { co2: "-1.5kg", water: "+80L", energy: "+30kWh" }
    },
    glass: {
        name: "Glass Bottle",
        type: "glass",
        recyclability: "Fully Recyclable",
        transformations: [
            { name: "New Bottles", icon: "fa-wine-bottle", desc: "Food containers" },
            { name: "Countertops", icon: "fa-square", desc: "Decorative surfaces" },
            { name: "Insulation", icon: "fa-fire", desc: "Building insulation" }
        ],
        process: "Collection → Sorting → Crushing → Melting",
        impact: { co2: "-0.8kg", water: "+40L", energy: "+25kWh" }
    },
    metal: {
        name: "Aluminum Can",
        type: "metal",
        recyclability: "Infinitely Recyclable",
        transformations: [
            { name: "New Cans", icon: "fa-beer", desc: "Beverage containers" },
            { name: "Auto Parts", icon: "fa-car", desc: "Vehicle components" },
            { name: "Building", icon: "fa-building", desc: "Construction elements" }
        ],
        process: "Collection → Shredding → De-coating → Melting",
        impact: { co2: "-4.2kg", water: "+10L", energy: "+95kWh" }
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { wasteDB };
}