import ImageSelect from "../../../src/app/components/Plant/SearchableImages";

describe("Searchable Images Function", () => {

    it("returns an icon based on plant name", () => {
        let plant = { "name": "Parsnip" };
        expect(ImageSelect(plant)).toBeTruthy();
    });

});