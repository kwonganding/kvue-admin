<template>
<div class="cards view">

  <el-card header="时间格式化" class="item" shadow="never">
    <p class="code">
      <b>formatTime：格式化日期时间</b>
    <pre>
let ts1 = formatTime(1690714796997) //2023-07-30 18:59:56
let ts2 = formatTime(1690714796997, '{y}年{m}月{d}日') //2023年07月30日
let ts3 = formatTime(new Date(), '{y}年{m}月{d}日') //2023年07月30日</pre>

    <b>formatNow：基于当前时间点格式化日期时间</b>
    <pre>
let tn1 = formatNow(1690714796997) //3小时前
let tn2 = formatNow(Date.now() - 100 * 1000) //2分钟前
let tn3 = formatNow(new Date(1988, 11, 12, 4, 15, 33) - 100 * 1000) //1988-12-12 </pre>
    </p>
  </el-card>

  <el-card header="时间格式化示例" class="item" shadow="never">
    <el-table :data="times">
      <el-table-column label="日期时间" prop="text"></el-table-column>

      <el-table-column label="formatTime" prop="value">
        <template slot-scope="scope">
          {{ formatTime(scope.row.value) }}
        </template>
      </el-table-column>
      <el-table-column label="formatTime('{y}年{m}月{d}日')" prop="value">
        <template slot-scope="scope">
          {{ formatTime(scope.row.value, '{y}年{m}月{d}日') }}
        </template>
      </el-table-column>

      <el-table-column label="formatNow" prop="value">
        <template slot-scope="scope">
          {{ formatNow(scope.row.value) }}
        </template>
      </el-table-column>

    </el-table>
  </el-card>
</div>
</template>

<script>
import { formatTime, formatNow } from '@/utils/date'

export default {
  name: "utils",
  data() {
    return {
      times: [
        { value: 1690714796997, text: '1690714796997' },
        { value: Date.now(), text: 'Date.now()' },
        { value: Date.now() - 100 * 1000, text: 'Date.now() - 100 * 1000' },
        { value: Date.now() - 7000 * 1000, text: 'Date.now() - 7000 * 1000' },
        { value: new Date().setFullYear(2022), text: 'new Date().setFullYear(2022)' },
        { value: new Date().setHours(-12), text: 'new Date().setHours(-12)' },
        { value: new Date(1988, 11, 12, 4, 15, 33), text: 'new Date(1988, 11, 12, 4, 15, 33)' },
      ]
    }
  },
  created() {
  },
  methods: {
    formatTime, formatNow
  },
}
</script>

<style lang="less" scoped>
.cards {
  display: flex;
  flex-flow: column;
  width: 100%;
  height: max-content;

  .item {
    margin: 10px 20px 20px 0;
    height: max-content;
  }

  .code {
    padding: 10px;
    margin: 10px 0;
    background: #000c;
    color: #f8951c;
    line-height: 1.8em;
    letter-spacing: 0.5px;
  }
}
</style>
