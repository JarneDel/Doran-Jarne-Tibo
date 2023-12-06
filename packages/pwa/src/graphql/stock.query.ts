import { gql, TypedDocumentNode } from '@apollo/client/core'
import {
  CreateStockInput,
  IUpdateItemOptional,
  IUpdateStock,
  StockItem,
} from '@/interface/stock.interface.ts'
import { ServiceItem } from '@/interface/service.interface.ts'

export const ALL_STOCK_AND_SERVICES: TypedDocumentNode<
  {
    stock: StockItem[]
    services: ServiceItem[]
  },
  {
    orderByField?: string
    orderDirection?: string
    searchName?: string
    searchServiceId?: string
  }
> = gql`
  query StockAndServices(
    $orderByField: String
    $orderDirection: String
    $searchName: String
    $searchServiceId: String
  ) {
    stock(
      orderByField: $orderByField
      orderDirection: $orderDirection
      searchName: $searchName
      searchServiceId: $searchServiceId
    ) {
      id
      name
      description
      amountInStock
      idealStock
      needToOrderMore
      service {
        id
        name
        description
      }
    }
    services {
      id
      name
    }
  }
`

export const ONE_STOCK: TypedDocumentNode<
  { stockItem: StockItem },
  { id: string }
> = gql`
  query OneStock($id: String!) {
    stockItem(id: $id) {
      id
      name
      description
      amountInStock
      idealStock
      service {
        id
        name
        description
      }
    }
  }
`

export const CREATE_STOCK: TypedDocumentNode<
  { createStock: { id: string } },
  { createStockInput: CreateStockInput }
> = gql`
  mutation ($createStockInput: CreateStockInput!) {
    createStock(createStockInput: $createStockInput) {
      id
      service {
        id
        name
        description
      }
      name
      amountInStock
      idealStock
      description
      needToOrderMore
    }
  }
`

export const UPDATE_STOCK: TypedDocumentNode<
  { updateStock: { id: string } },
  { updateStockInput: IUpdateStock }
> = gql`
  mutation ($updateStockInput: UpdateStockInput!) {
    updateStock(updateStockInput: $updateStockInput) {
      id
    }
  }
`

export const DELETE_STOCK: TypedDocumentNode<
  { removeStock: boolean },
  { id: string }
> = gql`
  mutation ($id: String!) {
    removeStock(id: $id)
  }
`

export const getUpdatedStockItem = (
  item: StockItem,
  update: IUpdateItemOptional,
): IUpdateStock => {
  let updatedItem: IUpdateStock = {
    id: item.id,
    amountInStock: Number(item.amountInStock),
    description: item.description,
    idealStock: Number(item.idealStock),
    name: item.name,
    needToOrderMore: item.needToOrderMore,
    serviceId: item.service.id,
  }
  return { ...updatedItem, ...update }
}

