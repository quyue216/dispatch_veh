module.exports = { extends: ['@commitlint/config-conventional'] };
/*

项目使用 Conventional Commits 规范，格式如下：


<type>(<scope>): <subject>
常用 type 类型
type	用途
feat	新功能
fix	修复 bug
refactor	重构（不新增功能/不修复 bug）
style	代码格式调整（不影响逻辑）
docs	文档变更
test	添加/修改测试
chore	构建流程、依赖更新等杂项
perf	性能优化
ci	CI 配置变更
revert	回滚提交
示例

git commit -m "feat(login): 添加微信扫码登录"
git commit -m "fix(order): 修复订单状态不同步问题"
git commit -m "refactor: 将 token 存储从 Cookie 改为 localStorage"
git commit -m "chore: 升级 ant-design 至 5.x"
规则要点
subject 使用中文或英文均可，结尾不加句号
scope 可选，表示影响范围（模块名、页面名等）
Breaking change 在 footer 中注明 BREAKING CHANGE: 说明
项目 recent commits 已在使用此规范（如 feat:、fix:、refactor: 前缀）。

*/
