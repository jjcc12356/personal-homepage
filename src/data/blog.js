// 阅读量来自 CSDN 公开页面快照，并非实时数据；整理日期：2026-09-21。
// 修改 views 数字即可重新排序；null 表示尚未核实，不代表零阅读。
export const blogHome = 'https://blog.csdn.net/2401_83410159?type=blog';
export const articles = [
  { id: '148356117', title: '湖师大C语言实验期末复查（完结）', views: 488 },
  { id: '146215141', title: 'C语言中的计算机基础（爆改学校的计算机课）', views: 1037 },
  { id: '146226535', title: '从学习ENVI中拾起遗忘的知识（一）', views: 948 },
  { id: '148260535', title: '湖师大C语言实验期末复查', views: null },
  { id: '148284805', title: '湖师大C语言实验期末复查', views: 616 },
  { id: '148305824', title: '湖师大C语言期末复查', views: 917 },
  { id: '148341960', title: '湖师大C语言期末复查', views: 1349 }
].map(article => ({
  ...article,
  url: 'https://blog.csdn.net/2401_83410159/article/details/' + article.id
}));
