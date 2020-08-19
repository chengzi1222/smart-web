import http from 'utils/http';

/**
 * 获取经营主体公共枚举信息
 */
export function getSubCommonEnumData() {
  return http({
    method: 'post',
    url: 'sub/common/getenumdata'
  });
}
