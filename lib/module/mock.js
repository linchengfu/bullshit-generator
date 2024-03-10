import fs from 'fs'
import path from 'path'
import url from 'url'


const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let dataCache = null;

function loadData() {
  if (!dataCache) {
    const file = path.resolve(__dirname, '../../mock/data.json');
    const data = JSON.parse(fs.readFileSync(file, { encoding: 'utf-8' }));
    const reports = data.dailyReports; // 数组格式的数据
    dataCache = {};
    // 把数组数据转换成以日期为key的JSON格式并缓存起来
    reports.forEach((report) => {
      dataCache[report?.updatedDate] = report;
    });
  }

  return dataCache;
}

export function getCoronavirusKeyIndex() {
  return Object.keys(loadData());
}

export function getCoronavirusByDate(date) {
  const dailyData = loadData()[date] || {};
  if (dailyData.countries) {
    // 按照各国确诊人数排序
    dailyData.countries.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
  }
  return dailyData;
}
