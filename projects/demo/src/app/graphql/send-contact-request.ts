// noinspection GraphQLUnresolvedReference

import { gql } from 'apollo-angular';

export const SEND_CONTACT_REQUEST = gql`
  mutation SendContactRequest($input: SendContactRequestInput) {
    sendContactRequest(input: $input)
  }
`;
