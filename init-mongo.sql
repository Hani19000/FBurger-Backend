db = db.getSiblingDB('fburger');


db.reviews.drop();

db.reviews.insertMany([
  {
    "rating": 5,
    "content": "Le Classic Burger est incroyable ! La viande est juteuse et le pain très frais.",
    "user_id": "550e8400-e29b-41d4-a716-446655440000", -- Format UUID cohérent avec Postgres
    "product_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "createdAt": new Date()
  },
  {
    "rating": 4,
    "content": "Très bon burger montagnard, mais un peu trop de fromage à mon goût.",
    "user_id": "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
    "product_id": "b1ccbc99-9c0b-4ef8-bb6d-6bb9bd380a22",
    "createdAt": new Date()
  },
  {
    "rating": 2,
    "content": "Livraison un peu lente, le burger est arrivé froid.",
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "product_id": "a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11",
    "createdAt": new Date()
  }
]);

print("Initialisation MongoDB terminée avec succès !");