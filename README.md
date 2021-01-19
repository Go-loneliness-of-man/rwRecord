# rwRecord
适用于高自由度场景的 node 日志插件

# 使用

构造函数七个参数：

+ root，String，根路径
+ typeList，[ String ]，日志类型列表
+ render，Function，渲染方法，由用户传入
+ env，String，运行环境
+ isDefaultRows，Boolean，是否生成默认行
+ defaultRows，Function，生成默认行的方法，会被传入参数 type
+ max，int，队列等待执行的最大长度

其中 typeList 代表日志类型，会生成每一项对应的工具函数。

具体使用参照 index.js 示例。
