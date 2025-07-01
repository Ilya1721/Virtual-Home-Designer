import { DatabaseMock } from "./mocks/DatabaseMock";
import { CatalogueService } from "../business_model/CatalogueService";
import { BusinessError } from "../business_model/concrete/error";

const database = new DatabaseMock();
const catalogueService = new CatalogueService(database);

const getAllGroupsMock = jest
  .spyOn(database, "getAllGroups")
  .mockImplementation(async () => {
    return database.getAllGroups();
  });

const getAllItemsOfGroupMock = jest
  .spyOn(database, "getAllItemsOfGroup")
  .mockImplementation(async (groupId: string) => {
    return database.getAllItemsOfGroup(groupId);
  });

jest.spyOn(console, "error").mockImplementation(() => {});

const mockedGroups = [
  {
    id: "group1",
    name: "Living Room",
    description: "Items for the living room",
    createdAt: new Date(),
  },
  {
    id: "group2",
    name: "Bedroom",
    description: "Items for the bedroom",
    createdAt: new Date(),
  },
];

const mockedItems = [
  {
    id: "item1",
    name: "Sofa",
    description: "A comfortable sofa",
    previewImageUrl: "http://example.com/sofa.jpg",
    fileUrl: "http://example.com/sofa.obj",
    createdAt: new Date(),
    group: mockedGroups[0],
  },
  {
    id: "item2",
    name: "Bed",
    description: "A cozy bed",
    previewImageUrl: "http://example.com/bed.jpg",
    fileUrl: "http://example.com/bed.obj",
    createdAt: new Date(),
    group: mockedGroups[1],
  },
];

describe("getAllGroups", () => {
  test("Should return all groups from the database", async () => {
    getAllGroupsMock.mockResolvedValue(mockedGroups);
    const groups = await catalogueService.getAllGroups();
    expect(groups).toEqual(mockedGroups);
    expect(getAllGroupsMock).toHaveBeenCalled();
  });

  test("Should throw the correct error when database throws error", async () => {
    getAllGroupsMock.mockRejectedValue(new Error("Database error"));
    await expect(catalogueService.getAllGroups()).rejects.toThrow(
      BusinessError.PROBLEM_WITH_DATABASE
    );
    expect(getAllGroupsMock).toHaveBeenCalled();
  })
});

describe("getAllItemsOfGroup", () => {
  test("Should return all items of a group from the database", async () => {
    const groupId = "group1";
    getAllItemsOfGroupMock.mockResolvedValue(mockedItems.filter(item => item.group.id === groupId));
    const items = await catalogueService.getAllItemsOfGroup(groupId);
    expect(items).toEqual(mockedItems.filter(item => item.group.id === groupId));
    expect(getAllItemsOfGroupMock).toHaveBeenCalledWith(groupId);
  });

  test("Should return empty array for a group that doesn't exist", async () => {
    const groupId = "non-existent-group";
    getAllItemsOfGroupMock.mockResolvedValue([]);
    const items = await catalogueService.getAllItemsOfGroup(groupId);
    expect(items).toHaveLength(0);
  });

  test("Should throw the correct error when database throws error", async () => {
    getAllItemsOfGroupMock.mockRejectedValue(new Error("Database error"));
    await expect(catalogueService.getAllItemsOfGroup("group1")).rejects.toThrow(
      BusinessError.PROBLEM_WITH_DATABASE
    );
  });
});
