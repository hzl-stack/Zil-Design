describe('测试组件是否修改', () => {
  test('Snapshot Test:', () => {
    expect(document.body).toMatchSnapshot(); // 首次执行会生成快照文件。
  });
});
