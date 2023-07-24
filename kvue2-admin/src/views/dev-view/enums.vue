<template>
  <div>
    <el-tabs>
      <el-tab-pane v-for="item in enums" :key="item.name" :label="item.name + '-' + item.text">
        <p class="code">
          <b>{{ item.name }} 定义：</b>
          {{ item.code }}

          <br />
          <b>{{ item.name }}.keys：</b>
          {{ JSON.stringify(item.enum.keys) }}

          <br />
          <b>{{ item.name }}.entries：</b>
          {{ JSON.stringify(item.enum.entries) }}

          <br />
          <b>下拉框使用：</b>
          <pre>&lt;el-select v-model=&quot;value&quot;&gt;</pre>
          <pre
            style="text-indent: 2em;">&lt;el-option v-for=&quot;e in {{ item.name }}.entries&quot; :key=&quot;e.key&quot; :value=&quot;e.key&quot; :label=&quot;e.text&quot;&gt;&lt;/el-option&gt;</pre>
          <pre>&lt;/el-select&gt;</pre>

          <b>单选组使用：</b>
          <pre>&lt;el-radio-group v-model=&quot;value&quot;&gt;</pre>
          <pre
            style="text-indent: 2em;">&lt;el-radio-button v-for=&quot;e in {{ item.name }}.entries&quot; :key=&quot;e.key&quot; :label=&quot;e.key&quot;&gt;<code>&#123;&#123;</code> e.text <code>&#125;&#125;</code>&lt;/el-radio-button&gt;</pre>
          <pre>&lt;/el-radio-group&gt;</pre>

          <b>标签使用：</b>
          <pre>&lt;el-tag :type=&quot;{{ item.name }}[value]?.type&quot;&gt;<code>&#123;&#123;</code> {{ item.name }}[value]?.text <code>&#125;&#125;</code>&lt;/el-tag&gt; </pre>
        </p>
        <el-form>
          <el-form-item label="下拉选择">
            <el-select v-model="item.value">
              <el-option v-for="e in item.enum.entries" :key="e.key" :value="e.key" :label="e.text"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="单选组1">
            <el-radio-group v-model="item.value">
              <el-radio-button v-for="item in item.enum.entries" :key="item.key" :label="item.key">{{ item.text }}</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="单选组2">
            <el-radio-group v-model="item.value">
              <el-radio v-for="item in item.enum.entries" :key="item.key" :label="item.key">{{ item.text }}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="状态标签-all">
            <el-tag v-for="tag in item.enum.entries" :key="tag.key" :type="tag.type" style="margin-right: 10px;">
              {{tag.text }}
            </el-tag>
          </el-form-item>
          <el-form-item label="状态标签-值">
            <el-tag :type="item.enum[item.value]?.type">{{ item.enum[item.value]?.text }} : {{ item.value }}</el-tag>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-divider></el-divider>
    <h3>表格中使用</h3>
    <br>
    <el-table :data="table">
      <el-table-column label="姓名" prop="name"  width="220px"></el-table-column>
      <el-table-column label="性别" prop="gender" align="center"  width="120px">
        <template slot-scope="scope">
          <el-tag :type="enumGender[scope.row.gender]?.type">{{ enumGender[scope.row.gender]?.text }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="方向" prop="align" :formatter="enumAlign.formatter"  width="120px"></el-table-column>
      <el-table-column label="状态" prop="use" align="center" width="120px">
        <template slot-scope="scope">
          <el-tag :type="enumUse[scope.row.use]?.type">{{ enumUse[scope.row.use]?.text }}</el-tag>
        </template>
      </el-table-column>
    </el-table>
    <div>

    </div>

  </div>
</template>

<script>
import EnumFactory from '@/utils/enumFactory';
import { enumGender, enumUse } from '@/model/enums.js'
const enumAlign = new EnumFactory({ '0': '左', '1': '中', '2': '右' },parseInt)

// 1、element中表格绑定，用tableFormater格式化显示文本
// 2、<el-tag>中使用，用text、type显示文本和状态
// 3、表格中可能也会用到<el-tag>
// 4、表单下拉框，或单选按钮组，绑定key、text

export default {
  name: 'enums',
  data() {
    return {
      enumAlign, enumGender, enumUse,
      value: '',
      enums: [
        {
          name: 'enumAlign',
          text: '对齐方式枚举',
          enum: enumAlign,
          value: 'left',
          code: "const enumAlign = new EnumFactory({ left: '左', middle: '中', right: '右' })",
        },
        {
          name: 'enumGender',
          text: '性别枚举',
          enum: enumGender,
          value: 'male',
          code: `const enumGender = new EnumFactory({ male: { text: '男', type: 'priary' }, female: { text: '女', type: 'warning' }, other: { text: '其他', type: 'info' }, })`
        },
        {
          name: 'enumUse',
          text: '使用状态枚举',
          enum: enumUse,
          value: 'disable',
          code: `const enumUse = new EnumFactory({ enable: { text: '启用', type: 'success' }, disable: { text: '禁用', type: 'error' } })`
        }
      ],
      table:[
        {name:'张三',gender:'male',align:'0',use:'enable'},
        {name:'刀刀狼',gender:'other',align:0,use:'disable'},
        {name:'李四四',gender:'female',align:1,use:'enable'},
        {name:'基辛格',gender:'male',align:2,use:'disable'},
      ]
    }
  },
  methods: {

  }
}
</script>

<style lang='less' scoped>
.code {
  padding: 10px;
  margin: 10px 0;
  background: #000c;
  color: #fff;
  line-height: 1.8em;
  letter-spacing: 0.5px;
}
</style>
