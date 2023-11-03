import gql from 'graphql-tag'

export const ALL_RESERVATIONS = gql`
query {
    GetAllReservations{
     id
     date
       startTime
       endTime
     group{id UID locale role createdAt updatedAt name btwNumber score}
       reservedMaterials {
         name
         totalAmount
         wantedAmount
         price
         sports
         isComplete
         description
       }
       rooms {
         name
         sports
         pricePerHour
         type
       }
       price
       isCancelled
     }
   }
`