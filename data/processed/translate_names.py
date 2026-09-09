"""Buat kolom nama Bahasa Indonesia untuk database makanan dan latihan.

Script ini sepenuhnya offline. Tidak memerlukan API key, koneksi internet,
atau paket tambahan selain pandas yang sudah dipakai oleh project.
"""

import re
from pathlib import Path

import pandas as pd


BASE_DIR = Path(__file__).parent
FOOD_CSV_IN = BASE_DIR / "food_clean.csv"
GYM_CSV_IN = BASE_DIR / "gym_clean.csv"
FOOD_CSV_OUT = BASE_DIR / "food_clean_id.csv"
GYM_CSV_OUT = BASE_DIR / "gym_clean_id.csv"


def replace_terms(value: str, phrases: dict[str, str]) -> str:
    """Replace phrases case-insensitively, starting with the longest phrase."""
    result = str(value)
    for source, target in sorted(phrases.items(), key=lambda item: -len(item[0])):
        result = re.sub(rf"\b{re.escape(source)}\b", target, result, flags=re.IGNORECASE)
    return re.sub(r"\s+", " ", result).strip()


FOOD_PHRASES = {
    "scrambled eggs": "telur orak-arik",
    "fried eggs": "telur goreng",
    "boiled eggs": "telur rebus",
    "poached eggs": "telur poached",
    "grilled chicken": "ayam panggang",
    "roasted chicken": "ayam panggang",
    "fried chicken": "ayam goreng",
    "chicken breast": "dada ayam",
    "chicken thigh": "paha ayam",
    "grilled salmon": "salmon panggang",
    "grilled fish": "ikan panggang",
    "tuna salad": "salad tuna",
    "chicken salad": "salad ayam",
    "fruit salad": "salad buah",
    "greek yogurt": "yoghurt Yunani",
    "peanut butter": "selai kacang",
    "sweet potato": "ubi jalar",
    "brown rice": "nasi merah",
    "white rice": "nasi putih",
    "fried rice": "nasi goreng",
    "whole wheat": "gandum utuh",
    "whole grain": "biji-bijian utuh",
    "black coffee": "kopi hitam",
    "oatmeal": "bubur oat",
    "protein shake": "minuman protein",
    "tomato soup": "sup tomat",
    "chicken soup": "sup ayam",
    "vegetable soup": "sup sayuran",
    "beef steak": "steak daging sapi",
    "grilled beef": "daging sapi panggang",
    "beef burger": "burger daging sapi",
    "avocado toast": "roti panggang alpukat",
    "french toast": "roti panggang Perancis",
    "banana bread": "roti pisang",
}

FOOD_WORDS = {
    "apple": "apel", "banana": "pisang", "orange": "jeruk", "mango": "mangga",
    "berries": "beri", "strawberry": "stroberi", "blueberry": "bluberi",
    "salad": "salad", "soup": "sup", "chicken": "ayam", "beef": "daging sapi",
    "pork": "daging babi", "fish": "ikan", "salmon": "salmon", "tuna": "tuna",
    "shrimp": "udang", "egg": "telur", "eggs": "telur", "cheese": "keju",
    "milk": "susu", "yogurt": "yoghurt", "bread": "roti", "toast": "roti panggang",
    "rice": "nasi", "pasta": "pasta", "noodles": "mi", "quinoa": "quinoa",
    "oats": "oat", "potato": "kentang", "spinach": "bayam", "broccoli": "brokoli",
    "carrot": "wortel", "tomato": "tomat", "cucumber": "mentimun", "avocado": "alpukat",
    "beans": "kacang", "lentils": "lentil", "almonds": "kacang almond",
    "walnuts": "kacang kenari", "coffee": "kopi", "tea": "teh", "water": "air",
    "sandwich": "sandwich", "burger": "burger", "pizza": "pizza", "burrito": "burrito",
    "pancakes": "panekuk", "waffles": "wafel", "cereal": "sereal", "smoothie": "smoothie",
    "grilled": "panggang", "roasted": "panggang", "baked": "panggang", "steamed": "kukus",
    "boiled": "rebus", "fried": "goreng", "fresh": "segar", "spicy": "pedas",
    "large": "besar", "small": "kecil", "medium": "sedang", "black": "hitam",
    "cooked": "matang", "raw": "mentah", "serving": "porsi", "slice": "iris",
    "cup": "cangkir", "tablespoon": "sendok makan", "teaspoon": "sendok teh",
}

GYM_PHRASES = {
    "standing calf raise": "angkat betis berdiri",
    "seated calf raise": "angkat betis duduk",
    "lying leg raise": "angkat kaki berbaring",
    "hanging leg raise": "angkat kaki menggantung",
    "front dumbbell raise": "angkat dumbbell depan",
    "lateral dumbbell raise": "angkat dumbbell ke samping",
    "dumbbell shoulder press": "dorongan bahu dumbbell",
    "barbell bench press": "dorongan dada barbell",
    "close-grip bench press": "dorongan dada pegangan sempit",
    "incline bench press": "dorongan dada bangku miring",
    "decline bench press": "dorongan dada bangku menurun",
    "single-arm dumbbell row": "tarikan dumbbell satu lengan",
    "bent-over barbell row": "tarikan barbell membungkuk",
    "seated cable row": "tarikan kabel duduk",
    "cable crossover": "silang kabel",
    "tricep pushdown": "dorongan trisep",
    "triceps pushdown": "dorongan trisep",
    "standing biceps curl": "tekukan bisep berdiri",
    "preacher curl": "tekukan preacher",
    "lying leg curl": "tekukan kaki berbaring",
    "leg extension": "ekstensi kaki",
    "leg press": "dorongan kaki",
    "front squat": "squat depan",
    "back squat": "squat belakang",
    "goblet squat": "goblet squat",
    "bulgarian split squat": "split squat Bulgaria",
    "romanian deadlift": "deadlift Rumania",
    "stiff leg deadlift": "deadlift kaki kaku",
    "straight-leg deadlift": "deadlift kaki lurus",
    "push-up": "push-up",
    "pull-up": "pull-up",
    "chin-up": "chin-up",
    "bodyweight squat": "squat berat badan",
    "jumping jack": "lompat jack",
    "mountain climber": "pendaki gunung",
    "burpee": "burpee",
    "plank jack": "plank jack",
    "side plank": "plank samping",
    "front plank": "plank depan",
    "russian twist": "putaran Rusia",
    "crunch": "crunch",
    "sit-up": "sit-up",
    "roll-out": "roll-out",
    "face pull": "tarikan wajah",
    "upright row": "tarikan tegak",
    "low-to-high twist": "putaran bawah ke atas",
}

GYM_WORDS = {
    "raise": "angkat", "raises": "angkat", "press": "dorongan", "row": "tarikan",
    "rows": "tarikan", "curl": "tekukan", "curls": "tekukan", "extension": "ekstensi",
    "extensions": "ekstensi", "twist": "putaran", "twists": "putaran", "fly": "fly",
    "flyes": "fly", "kickback": "tendangan belakang", "kickbacks": "tendangan belakang",
    "pull": "tarikan", "push": "dorongan", "lift": "angkat", "lunge": "lunge",
    "lunges": "lunge", "squat": "squat", "squats": "squat", "deadlift": "deadlift",
    "plank": "plank", "bench": "bangku", "incline": "miring", "decline": "menurun",
    "standing": "berdiri", "seated": "duduk", "lying": "berbaring", "hanging": "menggantung",
    "bent-over": "membungkuk", "single-arm": "satu lengan", "double-arm": "dua lengan",
    "close-grip": "pegangan sempit", "wide-grip": "pegangan lebar", "front": "depan",
    "back": "belakang", "side": "samping", "barbell": "barbell", "dumbbell": "dumbbell",
    "kettlebell": "kettlebell", "cable": "kabel", "machine": "mesin", "band": "band",
    "banded": "dengan band", "partner": "pasangan", "hold": "tahan", "jack": "lompat jack",
    "bodyweight": "berat badan", "weighted": "berbeban", "rope": "tali", "plate": "pelat",
    "shoulder": "bahu", "chest": "dada", "back": "punggung", "leg": "kaki",
    "legs": "kaki", "arm": "lengan", "arms": "lengan", "biceps": "bisep",
    "triceps": "trisep", "calf": "betis", "calves": "betis", "hip": "pinggul",
    "glute": "bokong", "glutes": "bokong", "abdominal": "perut", "abdominals": "perut",
    "isometric": "isometrik", "alternate": "bergantian", "alternating": "bergantian",
    "modified": "modifikasi", "assisted": "dengan bantuan", "explosive": "eksplosif",
}


def translate_food_name(name: str) -> str:
    return replace_terms(replace_terms(name, FOOD_PHRASES), FOOD_WORDS)


def translate_gym_name(name: str) -> str:
    return replace_terms(replace_terms(name, GYM_PHRASES), GYM_WORDS)


def main() -> None:
    food_df = pd.read_csv(FOOD_CSV_IN)
    food_df["food_name_id"] = food_df["food_name"].map(translate_food_name)
    food_df.to_csv(FOOD_CSV_OUT, index=False)
    print(f"[FOOD] {len(food_df)} baris diterjemahkan offline -> {FOOD_CSV_OUT.name}")

    gym_df = pd.read_csv(GYM_CSV_IN)
    gym_df["title_id"] = gym_df["Title"].map(translate_gym_name)
    gym_df.to_csv(GYM_CSV_OUT, index=False)
    print(f"[GYM] {len(gym_df)} baris diterjemahkan offline -> {GYM_CSV_OUT.name}")


if __name__ == "__main__":
    main()
