const fs = require('fs');
const Papa = require('papaparse');
const iconv = require('iconv-lite');

const csvPath = 'D:\\迅雷下载\\8b310c28-9d2c-49f3-8273-bcc8597e2894ExportBlock-c0df1482-64d3-465e-8654-75612a98ab6a\\ExportBlock-c0df1482-64d3-465e-8654-75612a98ab6a-Part-1\\galgame整理 308d9616662180afba01d1164a6cdac6_GAMEACG管理 308d961666218152b20b000b3217d5fc.csv';
const outPath = 'd:\\trae_project\\app\\games.json';

function decodeCsv(buf) {
  if (buf.length >= 3 && buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF) {
    console.log('Detected UTF-8 BOM');
    return buf.slice(3).toString('utf-8');
  }
  if (buf.length >= 2 && buf[0] === 0xFF && buf[1] === 0xFE) {
    console.log('Detected UTF-16 LE BOM');
    return iconv.decode(buf.slice(2), 'utf-16le');
  }
  if (buf.length >= 2 && buf[0] === 0xFE && buf[1] === 0xFF) {
    console.log('Detected UTF-16 BE BOM');
    return iconv.decode(buf.slice(2), 'utf-16be');
  }
  const utf8Try = buf.toString('utf-8');
  const reEncoded = Buffer.from(utf8Try, 'utf-8');
  if (reEncoded.equals(buf)) {
    console.log('No BOM, valid UTF-8 detected');
    return utf8Try;
  }
  console.log('No BOM, UTF-8 invalid -> falling back to GBK');
  return iconv.decode(buf, 'gbk');
}

function convertRating(str) {
  if (!str) return 3;
  const s = str.trim();
  if (s.includes('SSS')) return 5;
  if (s.includes('SS')) return 4.5;
  if (s === 'S' || s.includes('S')) return 4;
  if (s.includes('A')) return 3;
  if (s.includes('B')) return 2;
  if (s.includes('X')) return 1;
  return 3;
}

function parseDate(str) {
  if (!str) return str;
  const m = str.match(/(\d{4})\D+(\d{1,2})\D+(\d{1,2})/);
  if (m) {
    const y = m[1], mo = String(m[2]).padStart(2, '0'), d = String(m[3]).padStart(2, '0');
    return `${y}-${mo}-${d}T00:00:00`;
  }
  return str;
}

function findHeader(headers, keyword) {
  return headers.findIndex(h => h.includes(keyword));
}

const buf = fs.readFileSync(csvPath);
console.log(`CSV file size: ${buf.length} bytes`);
const fileContent = decodeCsv(buf);
console.log(`Decoded content length: ${fileContent.length} chars`);

const result = Papa.parse(fileContent, {
  header: false,
  skipEmptyLines: true,
  quoteChar: '"',
  escapeChar: '"'
});

console.log(`Total rows: ${result.data.length}`);
const headers = result.data[0].map(h => h.trim());
console.log(`Headers count: ${headers.length}`);
console.log(`First 5 headers: ${JSON.stringify(headers.slice(0, 5))}`);

const titleIdx = findHeader(headers, '搜索');
const catIdx = findHeader(headers, '类型');
const ratingIdx = findHeader(headers, '评级');
const descIdx = findHeader(headers, '排雷');
const coverIdx = findHeader(headers, '封面');
const sizeIdx = findHeader(headers, '游戏名大小');
const dateIdx = findHeader(headers, '最后修改');

console.log(`Field indices: title=${titleIdx}, cat=${catIdx}, rating=${ratingIdx}, desc=${descIdx}, cover=${coverIdx}, size=${sizeIdx}, date=${dateIdx}`);

const output = [];
for (let r = 1; r < result.data.length; r++) {
  const row = result.data[r];
  if (!row || row.every(c => !c || !c.toString().trim())) continue;
  const rawData = {};
  headers.forEach((h, i) => { rawData[h] = (row[i] || '').trim(); });

  const title = titleIdx >= 0 ? (row[titleIdx] || '').trim() : '';
  const category = catIdx >= 0 ? (row[catIdx] || '').trim() : '';
  const ratingStr = ratingIdx >= 0 ? (row[ratingIdx] || '').trim() : '';
  const descRaw = descIdx >= 0 ? (row[descIdx] || '').trim() : '';
  const cover = coverIdx >= 0 ? (row[coverIdx] || '').trim() : '';
  const sizeStr = sizeIdx >= 0 ? (row[sizeIdx] || '').trim() : '';
  const updateDateStr = dateIdx >= 0 ? (row[dateIdx] || '').trim() : '';

  const rating = convertRating(ratingStr);
  const icon = (cover && /^https?:\/\//.test(cover)) ? cover : '\u{1F3AE}';
  const description = descRaw.length > 200 ? descRaw.slice(0, 200) : descRaw;
  const updateDate = parseDate(updateDateStr);

  output.push({
    id: r,
    title,
    icon,
    category,
    rating,
    downloads: sizeStr,
    description,
    updateDate,
    _rawFields: headers.slice(),
    _rawData: rawData
  });
}

fs.writeFileSync(outPath, JSON.stringify(output, null, 2), 'utf-8');
console.log(`Done! Converted ${output.length} records to ${outPath}`);

if (output.length > 0) {
  const first = output[0];
  console.log('\n--- First record verification ---');
  console.log(`title: ${first.title.slice(0, 60)}...`);
  console.log(`category: ${first.category}`);
  console.log(`rating: ${first.rating}`);
  console.log(`downloads: ${first.downloads}`);
  console.log(`updateDate: ${first.updateDate}`);
  console.log(`description: ${first.description.slice(0, 80)}...`);
  console.log(`_rawFields[0]: ${first._rawFields[0]}`);
  console.log(`_rawData keys[0..2]: ${JSON.stringify(Object.keys(first._rawData).slice(0, 3))}`);
}
