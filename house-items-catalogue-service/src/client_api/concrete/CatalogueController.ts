import {
  AbstractRequest,
  AbstractResponse,
  HouseItemDTO,
  HouseItemGroup,
} from "shared-types";
import { CatalogueService } from "../../business_model/CatalogueService";
import { HttpStatus } from "shared-utils";
import { getHttpStatusByError } from "../../business_model/concrete/error";

export class CatalogueController {
  constructor(private catalogueService: CatalogueService) {}

  public async getAllGroups(
    req: AbstractRequest<any>,
    res: AbstractResponse<HouseItemGroup[], unknown>
  ): Promise<void> {
    try {
      const groups = await this.catalogueService.getAllGroups();
      res.transformDataToJsonWithStatus(HttpStatus.OK, groups);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }

  public async getAllItemsOfGroup(
    req: AbstractRequest<any>,
    res: AbstractResponse<HouseItemDTO[], unknown>
  ): Promise<void> {
    try {
      const groupId = req.params.id;
      const items = await this.catalogueService.getAllItemsOfGroup(groupId);
      res.transformDataToJsonWithStatus(HttpStatus.OK, items);
    } catch (error) {
      const httpStatus = getHttpStatusByError(error);
      res.transformErrorToJsonWithStatus(httpStatus, error);
    }
  }
}
