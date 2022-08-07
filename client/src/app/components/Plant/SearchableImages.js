import Images from "../../assets/images/plant_icons/icons";

function imageSelect(imageName) {

    const images = {
        "Asparagus": Images.Asparagus,
        "Aubergine": Images.Aubergine,
        "Basil": Images.Basil,
        "Broccoli": Images.Broccoli,
        "Cabbage": Images.Cabbage,
        "Carrot": Images.Carrot,
        "Cauliflower": Images.Cauliflower,
        "Celery": Images.Celery,
        "Chard": Images.Chard,
        "Chives": Images.Chives,
        "Coriander": Images.Coriander,
        "Cucumber": Images.Cucumber,
        "Dill": Images.Dill,
        "Garlic": Images.Garlic,
        "Kale": Images.Kale,
        "Lettuce": Images.Lettuce,
        "Mint": Images.Mint,
        "Onion": Images.Onion,
        "Oregano": Images.Oregano,
        "Parsley": Images.Parsley,
        "Parsnip": Images.Parsnip,
        "Pea": Images.Pea,
        "Potato": Images.Potato,
        "Pumpkin": Images.Pumpkin,
        "Radish": Images.Radish,
        "Rhubarb": Images.Rhubarb,
        "Rosemary": Images.Rosemary,
        "Sage": Images.Sage,
        "Spinach": Images.Spinach,
        "Sweet Potato": Images["Sweet Potato"],
        "Sweetcorn": Images.Sweetcorn,
        "Tarragon": Images.Tarragon,
        "Thyme": Images.Thyme,
        "Tomato": Images.Tomato,
        "Turnip": Images.Turnip
    }

    const icon = images[imageName.name];

    return icon;
}

export default imageSelect;