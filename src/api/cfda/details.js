import http from "utils/http";
import qs from "qs";

export function getCfda(cfda) {
  return http({
    method: 'post',
    url: 'cfda/get',
    data: qs.stringify({cfda:cfda})
  });
}