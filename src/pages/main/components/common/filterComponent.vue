<template>
    <header class="filter-container">
        <div class="data-total">
            数据总量为
            <span class="count">{{dataCount}}</span>
            条
        </div>
        <div class="filter-wrapper">
            <div class="condition-wrapper">
                <el-input size="small" placeholder="搜索" v-model="keyword"
                          :class="['search-input',{'no-select':moduleType==='noSelect'}]"
                          @keyup.enter.native="searchKeyword">
                    <span slot="suffix" class="el-icon-search filter-input-icon" @click="searchKeyword"></span>
                </el-input>
                <el-select v-model="department" placeholder="请选择部门" size="small" class="department-select"
                           v-show="moduleType!=='noSelect'">
                    <el-option v-for="(department,index) in departments" :key="index" :label="department"
                               :value="department"></el-option>
                </el-select>
                <el-select v-model="role" placeholder="请选择角色" size="small" class="role-select"
                           v-show="moduleType!=='noSelect'">
                    <el-option v-for="(role,index) in roles" :key="index" :label="role"
                               :value="role"></el-option>
                </el-select>
            </div>
        </div>
        <div class="handle-wrapper">
            <!--icon="el-icon-circle-plus-outline"-->
            <el-button type="primary" size="mini" class="add-button" @click="addItem">
                新添
            </el-button>
            <el-dropdown trigger="click" v-show="moduleType!=='noSelect'">
                <span class="el-dropdown-link el-icon-more"
                      style="background-color:#303641;color:#fff;padding:7px 15px;border-radius:3px;"></span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item style="font-size: 12px;">
                        <i class="el-icon-delete" style="color:#FA5555"></i> 删除
                    </el-dropdown-item>
                    <el-dropdown-item style="font-size: 12px;">
                        <i class="el-icon-edit" style="color:#409EFF"></i> 修改
                    </el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </div>
    </header>
</template>

<script>
    export default {
        data() {
            return {
                department: '',
                departments: [
                    'K团',
                    '招兵部',
                    '开发部',
                    '野狼团'
                ],
                role: '',
                roles: [
                    '团长',
                    '经理',
                    '销售人员'
                ],
                moduleName: null,
                keyword: null
            }
        },
        props: {
            "data-count": Number,
            "filter-type": String
        },
        created() {
            this.moduleType = this.filterType;
        },
        mounted() {

        },
        methods: {
            addItem() {
                this.$emit('add-item', this.moduleName);
            },
            searchKeyword() {
                this.$emit('search-keyword', this.keyword, this.moduleName);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .filter-container {
        font-size: 0.9rem;
        flex-shrink: 0;
        height: 4rem;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        align-items: center;
        flex-flow: nowrap;
        .data-total {
            color: #7a8190;
            margin-right: 30px;
            flex-shrink: 0;
            .count {
                color: #ff8d8d;
            }
        }
        .filter-wrapper {
            display: flex;
            flex-flow: nowrap;
            justify-content: flex-start;
            flex-direction: row;
            align-items: center;
            .condition-wrapper {
                display: flex;
                flex-direction: row;
                align-items: center;
                flex-flow: nowrap;
                .search-input {
                    max-width: 40%;
                    margin-right: 20px;
                    &.no-select {
                        max-width: 100%;
                        width: 100%;
                    }
                    .filter-input-icon {
                        font-size: 1.4rem;
                        position: relative;
                        top: 0.3rem;
                        cursor: pointer;
                    }
                }
                .department-select {
                    max-width: 30%;
                    margin-right: 20px;
                }
                .role-select {
                    max-width: 30%;
                }
            }
        }
        .handle-wrapper {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: flex-start;
            margin-left: 15px;
            .add-button {
                min-width: 80px;
                color: #fff;
                background-color: #303641;
                margin-right: 15px;
            }
        }
    }
</style>