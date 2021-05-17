import axios from 'axios';

export const get = (url, config = {}) =>
  axios.get(url, appendAuthToken(config));

export const getGeocoding = (address) => {
  axios.get(
    'http://api.positionstack.com/v1/forward',
    {
      params: {
        access_key: '4c4e247cc0ea1229bd8b65391e01f244',
        query: address,
      }
    }
  )
}
