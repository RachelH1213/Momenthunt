import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
// 替换了可能导致命名冲突的 Route 组件，改用原生的 MapPin 等保证稳定性
import { Sparkles, MapPin, Compass, Navigation, X, Heart, CloudRain, Utensils, TreeDeciduous, Bell, Search, Mic, Clock, Users, DollarSign, ShoppingBag, Droplets, ChevronLeft, ArrowRight, Bookmark, Activity, Camera, Ticket, Award, MessageSquare, Info, Map as MapIcon, Layers, Zap, GripHorizontal } from 'lucide-react';
import logoImg from './assets/momenthunt_logo.png';
// ==========================================
// 1. 数据配置与高级动态散射引擎
// ==========================================

const mainTasks = [
  { id: "想逛逛", color: "#8B5CF6", icon: Compass, filters: ["小众一点", "适合拍照", "人少一点", "必打卡"] },
  { id: "想吃饭", color: "#F472B6", icon: Utensils, filters: ["近一点", "本地特色", "不排队", "家庭友好"] },
  { id: "想休息", color: "#FBBF24", icon: TreeDeciduous, filters: ["能坐下", "室内", "阴凉", "安静一点"] },
  { id: "找厕所", color: "#34D399", icon: Droplets, filters: ["最近", "干净", "免费", "无障碍"] },
  { id: "需要补给", color: "#3B82F6", icon: ShoppingBag, filters: ["买水", "纸巾", "充电宝", "最近"] },
  { id: "想避雨", color: "#F87171", icon: CloudRain, filters: ["最近", "室内", "能坐下", "顺路"] }
];

const generateBackgroundSpots = (category, count, centerLat, centerLng) => {
  const spots = [];
  const templates = {
    "想逛逛": { cat: 'SCENERY', names: ['广惠宫', '丝业会馆', '辑里湖丝馆', '刘氏梯号', '镇史馆', '頔步区', '运河长廊', '张静江故居', '百间楼', '小莲庄', '嘉业堂藏书楼', '十字水系', '东大街', '南市河', '通津桥', '洪济桥', '广惠桥', '北栅客运码头', '风情步行街', '民国旧址群', '南湖生态园', '西山湿地', '东林废旧厂房', '湖笔文化馆', '江南水乡民俗馆'] },
    "想吃饭": { cat: 'LOCAL FOOD', names: ['浔蹄面馆', '状元楼私房菜', '临水人家人客栈', '太湖白鱼馆', '银鱼炒蛋专门店', '三道茶馆', '东坡肉菜馆', '弄堂口馄饨', '老阿婆生煎', '西街深夜大排档', '湖畔渔家', '南桥烧烤', '李记手工糕点', '张师傅特色炒面', '江南春饭店', '水乡船宴', '渔人码头海鲜', '古树下土菜', '巷子里私房面', '百年老卤味'] },
    "想休息": { cat: 'REST AREA', names: ['沿河木质长椅', '廊桥水阁', '古樟树乘凉处', '半岛临水茶室', '旧时光咖啡馆', '游客驿站大堂', '东广场树荫', '南门休息长廊', '街角书吧', '码头等候区', '湿地公园草坪', '西郊露营地', '水榭凉亭', '风雨连廊休息区', '艺术中心中庭', '湖心岛凉亭', '竹林幽径石凳', '文化广场阶梯', '老茶馆外摆', '社区纳凉点'] },
    "找厕所": { cat: 'PUBLIC', names: ['东大街五星公厕', '游客中心北洗手间', '西门停车场卫生间', '丝业馆旁公厕', '南广场环保卫生间', '街心花园公厕', '商业街商场洗手间', '码头候船室厕所', '北郊湿地生态厕所', '公路驿站洗手间', '古镇出口洗手间', '文化馆内洗手间', '东林村公共厕所', '高速出口洗手间', '南湖公园公厕', '沿河临时厕所', '老街深处公厕', '西栅卫生间', '景区东门洗手间', '行政中心旁公厕'] },
    "需要补给": { cat: 'STORE', names: ['全家便利店 (南浔店)', '罗森 (古镇东街店)', '联华生活超市', '古井自动售货机', '街角日用杂货铺', '美团共享充电站', '怪兽充电宝专柜', '景区便民小卖部', '张记冷饮批发', '老街药房', '南门综合超市', '水乡特产超市', '24H无人售货亭', '驿站补给点', '十字路口便利店', '客运站小超', '北街水果生鲜', '充电休息站', '旅游纪念品店', '西山补给处'] },
    "想避雨": { cat: 'INDOOR', names: ['文化长廊', '古戏台底座', '检票口防雨大棚', '商业街骑楼', '地下过街通道', '古镇博物馆大堂', '江南丝竹馆', '客运站候车室', '大型连锁快餐店', '风雨桥', '民国建筑走廊', '艺术展览中心', '社区活动室', '东大街防雨连廊', '古建筑屋檐', '南市河避雨亭', '西交天桥底', '地下商场入口', '游客服务中心', '图书阅览室'] }
  };
  const tpl = templates[category];

  for (let i = 0; i < count; i++) {
    const minR = 0.012; 
    const maxR = 0.055; 
    const r = minR + (maxR - minR) * Math.sqrt(Math.random());
    const theta = Math.random() * 2 * Math.PI;
    const lat = centerLat + r * Math.cos(theta);
    const lng = centerLng + r * Math.sin(theta) * 1.2; 
    const uniqueImageId = Math.floor(Math.random() * 1000);
    const realName = tpl.names[i % tpl.names.length];

    spots.push({
      id: `bg_${category}_${i}`,
      name: realName,
      category: tpl.cat,
      title: "系统自动挖掘的周边探索点",
      desc: "距离核心景区较远，适合作为避开人流的备选方案。",
      filterTags: ["周边探索", "备选方案"],
      match: Math.floor(75 + Math.random() * 15) + "%",
      pos: [lat, lng],
      image: `https://picsum.photos/seed/${uniqueImageId + category}/500/300`,
      details: { time: "全天", crowd: "空闲", price: "平价" },
      ranking: "系统外围探索",
      comments: ["人确实少", "随便逛逛发现的"],
      ticketPrice: "免费",
      hasStamp: false,
      waitTime: "无需排队",
      crowdTrend: "平稳 →",
      routeTime: "骑行 " + Math.floor(10 + Math.random() * 20) + " 分钟",
      rating: (4.0 + Math.random() * 0.9).toFixed(1),
      distance: (1.5 + Math.random() * 5).toFixed(1) + "km"
    });
  }
  return spots;
};

const mockDatabase = {
  想逛逛: [
    { id: 's1', name: "王氏宗祠", category: "CULTURE", title: "探索非遗文化的深度体验", desc: "保存最完好的明清建筑群。目前人流较少，非常适合安静参观。", filterTags: ["人少一点", "必打卡"], match: "99%", pos: [30.8760, 120.4220], image: "https://images.unsplash.com/photo-1528605105345-5344ea20e269?w=500&q=80", details: { time: "08:00-17:30", crowd: "空闲", price: "免费" }, ranking: "南浔人文榜 Top 1", comments: ["非遗皮影戏太好看了！", "建筑很有历史感"], ticketPrice: "免费", hasStamp: true, waitTime: "1分钟", crowdTrend: "人流平稳 →", routeTime: "步行 5 分钟", rating: "4.9", distance: "320m" },
    { id: 's2', name: "烟雨长廊", category: "SCENERY", title: "捕捉光影的最佳机位", desc: "当前太阳偏角 45 度，光线温和且带有暖色调，适合拍摄古镇倒影全景。", filterTags: ["适合拍照", "必打卡"], match: "95%", pos: [30.8680, 120.4310], image: "https://images.unsplash.com/photo-1499856871958-5b9627545d1a?w=500&q=80", details: { time: "全天", crowd: "较多", price: "免费" }, ranking: "出片必去榜 Top 2", comments: ["穿汉服来拍照绝了", "光线最柔和"], ticketPrice: "免费", hasStamp: false, waitTime: "约 10 分钟", crowdTrend: "人流增多 ↗", routeTime: "步行 15 分钟", rating: "4.8", distance: "850m" },
    { id: 's3', name: "青石板幽巷", category: "HIDDEN GEM", title: "无商业化原生态街区", desc: "保留了原住民的生活气息，没有商铺喧嚣，非常出片且安静。", filterTags: ["小众一点", "适合拍照"], match: "92%", pos: [30.8820, 120.4150], image: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=500&q=80", details: { time: "全天", crowd: "极少", price: "免费" }, ranking: "小众秘境挖掘", comments: ["完全没有商业化"], ticketPrice: "免费", hasStamp: false, waitTime: "无人区", crowdTrend: "平稳 →", routeTime: "步行 12 分钟", rating: "4.7", distance: "1.2km" },
    { id: 's4', name: "古法造纸坊", category: "EXPERIENCE", title: "亲手制作属于你的东巴纸", desc: "隐藏在巷子深处的非遗体验馆。老板今天在店里，可体验完整工序。", filterTags: ["小众一点", "人少一点"], match: "89%", pos: [30.8690, 120.4080], image: "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=500&q=80", details: { time: "10:00-19:00", crowd: "较少", price: "¥68/人" }, ranking: "手作体验精选", comments: ["老板人超好！"], ticketPrice: "¥68", hasStamp: true, waitTime: "约 5 分钟", crowdTrend: "平稳 →", routeTime: "步行 20 分钟", rating: "4.9", distance: "1.5km" },
    ...generateBackgroundSpots("想逛逛", 25, 30.8760, 120.4220)
  ],
  想吃饭: [
    { id: 'f1', name: "临河私房菜", category: "LOCAL FOOD", title: "地道口味，绝佳观景位", desc: "招牌白斩鸡和太湖三白，二楼靠窗的观景位刚好空出一桌。", filterTags: ["本地特色", "不排队"], match: "98%", pos: [30.8790, 120.4280], image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=500&q=80", details: { time: "11:00-21:00", crowd: "空闲", price: "¥85/人" }, ranking: "本地美食榜 Top 1", comments: ["白斩鸡绝绝子！", "风景太棒了"], ticketPrice: null, hasStamp: false, waitTime: "当前免排队", crowdTrend: "人流减少 ↘", routeTime: "步行 8 分钟", rating: "4.8", distance: "450m" },
    { id: 'f2', name: "桥头面馆", category: "FAST FOOD", title: "三分钟即达的热腾腾汤面", desc: "距离您当前位置极近，主打特色红烧羊肉面，本地人最爱。", filterTags: ["近一点", "本地特色"], match: "85%", pos: [30.8660, 120.4190], image: "https://images.unsplash.com/photo-1552611052-33e04de081de?w=500&q=80", details: { time: "06:00-14:00", crowd: "适中", price: "¥25/人" }, ranking: "碳水面食榜", comments: ["面条劲道", "老爷爷都在吃"], ticketPrice: null, hasStamp: false, waitTime: "约 5 分钟", crowdTrend: "平稳 →", routeTime: "步行 12 分钟", rating: "4.6", distance: "200m" },
    { id: 'f3', name: "水乡人家土菜馆", category: "FAMILY", title: "适合全家老小的老字号", desc: "空间宽敞，提供婴儿座椅和无障碍通道，菜品口味清淡适中。", filterTags: ["家庭友好", "不排队"], match: "91%", pos: [30.8720, 120.4350], image: "https://images.unsplash.com/photo-1564834724105-918b73d1b9e0?w=500&q=80", details: { time: "10:30-21:30", crowd: "拥挤", price: "¥95/人" }, ranking: "家庭聚餐优选", comments: ["带老人吃不错", "有宝宝椅"], ticketPrice: null, hasStamp: false, waitTime: "约 30 分钟", crowdTrend: "增多 ↗", routeTime: "步行 18 分钟", rating: "4.5", distance: "890m" },
    { id: 'f4', name: "浔味糕点铺", category: "SNACKS", title: "刚出炉的桂花糕", desc: "本地阿婆现做的特色糕点，香气扑鼻，买一份边走边吃正合适。", filterTags: ["近一点", "不排队"], match: "94%", pos: [30.8850, 120.4210], image: "https://images.unsplash.com/photo-1525648199074-cee30ba79a4a?w=500&q=80", details: { time: "09:00-20:00", crowd: "空闲", price: "¥15/人" }, ranking: "必吃小吃榜", comments: ["趁热吃绝了", "香软糯"], ticketPrice: null, hasStamp: false, waitTime: "立等可取", crowdTrend: "平稳 →", routeTime: "步行 6 分钟", rating: "4.9", distance: "150m" },
    ...generateBackgroundSpots("想吃饭", 25, 30.8760, 120.4220)
  ],
  想休息: [
    ...generateBackgroundSpots("想休息", 25, 30.8760, 120.4220)
  ],
  找厕所: [
    ...generateBackgroundSpots("找厕所", 25, 30.8760, 120.4220)
  ],
  需要补给: [
    ...generateBackgroundSpots("需要补给", 25, 30.8760, 120.4220)
  ],
  想避雨: [
    ...generateBackgroundSpots("想避雨", 25, 30.8760, 120.4220)
  ]
};

// ⭐️ 动态突发高光活动数据模型
const dynamicEventMock = {
  id: 'event_special_01',
  name: "水上打铁花",
  category: "LIMITED EVENT",
  title: "即将开始的限时高光表演！",
  desc: "非遗水上烟火秀。AI 测算与您的主线偏好极度吻合，前往原定地点前不妨顺路打卡，错开高峰。",
  filterTags: ["限时高光", "极其出片", "顺路加塞"],
  match: "98%",
  pos: [30.8730, 120.4265], 
  image: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
  details: { time: "20:00 开演", crowd: "适中", price: "免费观看" },
  ranking: "实时热度飙升 Top 1",
  comments: ["震撼到失语！", "非常出片"],
  ticketPrice: "免费",
  hasStamp: true,
  waitTime: "提前15分占位",
  crowdTrend: "激增 ↗",
  routeTime: "顺路多走3分钟",
  rating: "5.0",
  distance: "200m"
};

const scatterTransforms = [
  { x: 0, y: 30, rotate: 0, scale: 1 },         
  { x: -120, y: -160, rotate: 0, scale: 0.55 }, 
  { x: 80, y: -230, rotate: 0, scale: 0.75 },   
  { x: 140, y: -70, rotate: 0, scale: 0.35 },
  { x: -90, y: 110, rotate: 0, scale: 0.85 }
];

const ChevronRightIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-300">
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const buildRealisticRoute = (points) => {
  if (points.length < 2) return points;
  let route = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i+1];
    if (!Array.isArray(p1) || !Array.isArray(p2) || isNaN(p1[0]) || isNaN(p2[0])) continue; 
    const midLat = p1[0] + (p2[0] - p1[0]) * 0.3;
    const midLng = p1[1] + (p2[1] - p1[1]) * 0.7;
    route.push(p1, [midLat, p1[1]], [midLat, midLng], [p2[0], midLng], p2);
  }
  return route;
};

const getTaskSvg = (taskId) => {
  const svgs = {
    "想逛逛": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/></svg>`,
    "想吃饭": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2"/><path d="M7 2v20"/><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7"/></svg>`,
    "想休息": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M13 22v-7.1"/><path d="M16 11c0 2.2-1.8 4-4 4s-4-1.8-4-4c0-2 1.3-3.6 3.1-3.9A4.1 4.1 0 0 1 12 3a4.1 4.1 0 0 1 4.9 4.1C18.7 7.4 20 9 20 11c0 2.2-1.8 4-4 4Z"/></svg>`,
    "找厕所": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M7 16.3c2.2 0 4-1.83 4-4.05 0-1.16-.57-2.26-1.71-3.19S7 2.99 7 2.99s-2.29 6.05-3.29 6.98S2 11.15 2 12.25c0 2.22 1.8 4.05 4 4.05z"/><path d="M12.56 6.6A10.97 10.97 0 0 0 14 3.02c.5 2.5 2 4.9 4 6.5s3 3.5 3 5.5a6.98 6.98 0 0 1-11.91 4.97"/></svg>`,
    "需要补给": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
    "想避雨": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M16 14v6"/><path d="M8 14v6"/><path d="M12 16v6"/></svg>`,
    "LIMITED EVENT": `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`
  };
  return svgs[taskId] || svgs["想逛逛"];
};

const getPulseConfig = (card) => {
  if (card.category === "LIMITED EVENT") {
    return { 
      colorClass: "bg-purple-600", textClass: "text-purple-500", hex: "#9333ea",
      html: `
        <div style="position: absolute; left: -35px; top: -35px; width: 70px; height: 70px; border-radius: 50%; background: rgba(147,51,234,0.2); border: 2px solid rgba(147,51,234,0.8); animation: map-ripple-event 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
        <div style="position: absolute; left: -35px; top: -35px; width: 70px; height: 70px; border-radius: 50%; background: rgba(147,51,234,0.2); border: 2px solid rgba(147,51,234,0.8); animation: map-ripple-event 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; animation-delay: 1.75s;"></div>
      `
    };
  }
  const desc = String(card.waitTime + card.crowdTrend + (card.details?.crowd || "")).toLowerCase();
  
  if (/(多|挤|满|排队|增多|等位|拥)/.test(desc)) {
    return { 
      colorClass: "bg-rose-500", textClass: "text-rose-500", hex: "#f43f5e",
      html: `
        <div style="position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: rgba(244,63,94,0.2); border: 1.5px solid rgba(244,63,94,0.8); animation: map-ripple-severe 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
        <div style="position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: rgba(244,63,94,0.2); border: 1.5px solid rgba(244,63,94,0.8); animation: map-ripple-severe 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; animation-delay: 1s;"></div>
        <div style="position: absolute; left: -30px; top: -30px; width: 60px; height: 60px; border-radius: 50%; background: rgba(244,63,94,0.2); border: 1.5px solid rgba(244,63,94,0.8); animation: map-ripple-severe 3s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; animation-delay: 2s;"></div>
      `
    };
  }
  if (/(适中|少|等|找|平稳)/.test(desc)) {
    return { 
      colorClass: "bg-amber-400", textClass: "text-amber-500", hex: "#fbbf24",
      html: `
        <div style="position: absolute; left: -25px; top: -25px; width: 50px; height: 50px; border-radius: 50%; background: rgba(251,191,36,0.15); border: 1.5px solid rgba(251,191,36,0.8); animation: map-ripple-moderate 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
        <div style="position: absolute; left: -25px; top: -25px; width: 50px; height: 50px; border-radius: 50%; background: rgba(251,191,36,0.15); border: 1.5px solid rgba(251,191,36,0.8); animation: map-ripple-moderate 4s cubic-bezier(0.2, 0.8, 0.2, 1) infinite; animation-delay: 2s;"></div>
      `
    };
  }
  return { 
    colorClass: "bg-emerald-400", textClass: "text-emerald-500", hex: "#34d399",
    html: `
      <div style="position: absolute; left: -20px; top: -20px; width: 40px; height: 40px; border-radius: 50%; background: rgba(52,211,153,0.15); border: 1.5px solid rgba(52,211,153,0.8); animation: map-ripple-calm 6s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;"></div>
    `
  };
};

const parseIntent = (inputText) => {
  const text = inputText.toLowerCase();
  if (/(累|坐|休息|脚酸|走不动|歇|累死|腿酸|坐会|沙发|不想走)/.test(text)) return { task: "想休息", filter: "能坐下" };
  if (/(厕所|洗手间|卫生间|茅房|尿|屎|急|方便|憋不住|拉肚子)/.test(text)) return { task: "找厕所", filter: "最近" };
  if (/(雨|伞|淋|晒|热|避暑|暴晒|太热了|下雨)/.test(text)) return { task: "想避雨", filter: "室内" };
  if (/(饿|饭|吃|美食|餐厅|小吃|餐馆|日料|面|好吃的)/.test(text)) return { task: "想吃饭", filter: "本地特色" };
  if (/(渴|水|饮料|纸巾|充电|没电|关机|电量低|便利店|买)/.test(text)) return { task: "需要补给", filter: "最近" };
  if (/(拍照|出片|打卡|风景|逛|玩|无聊|美景|好看)/.test(text)) return { task: "想逛逛", filter: "适合拍照" };
  return { task: "想逛逛", filter: "必打卡" };
};

// ==========================================
// 主应用程序 (Main App)
// ==========================================

export default function App() {
  const [view, setView] = useState('home'); 
  const [currentTask, setCurrentTask] = useState("想逛逛");
  const [currentFilter, setCurrentFilter] = useState("人少一点"); 
  
  const [cards, setCards] = useState(mockDatabase["想逛逛"] || []);
  const [savedCards, setSavedCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  
  const [swipeFeedback, setSwipeFeedback] = useState(null); 
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [isMapMode, setIsMapMode] = useState(false);
  const [zoomLod, setZoomLod] = useState(1);

  const [pendingDynamicEvent, setPendingDynamicEvent] = useState(null); 
  const [isTimelineMode, setIsTimelineMode] = useState(false);
  const [routeUpdatedToast, setRouteUpdatedToast] = useState(false);
  const [isDraggingOrb, setIsDraggingOrb] = useState(false);

  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const markersRef = useRef([]);
  const polylineRef = useRef(null);
  const [leafletLoaded, setLeafletLoaded] = useState(false);

  const activeTaskConfig = mainTasks.find(t => t.id === currentTask) || mainTasks[0];

  const safeFlyTo = (lat, lng, zoom, options = {}) => {
    if (mapInstance.current && typeof lat === 'number' && typeof lng === 'number' && !isNaN(lat) && !isNaN(lng)) {
      if (mapInstance.current.getSize().x > 0 && mapInstance.current.getSize().y > 0) {
        mapInstance.current.flyTo([lat, lng], zoom, options);
      } else {
        setTimeout(() => {
          if (mapInstance.current && mapInstance.current.getSize().x > 0) {
            mapInstance.current.invalidateSize();
            mapInstance.current.flyTo([lat, lng], zoom, options);
          }
        }, 150);
      }
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setPendingDynamicEvent(dynamicEventMock);
      setIsTimelineMode(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (window.L) { setLeafletLoaded(true); return; }
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'; document.head.appendChild(link);
    const script = document.createElement('script'); script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; script.onload = () => setLeafletLoaded(true); document.head.appendChild(script);
    
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-div-icon { background: transparent; border: none; overflow: visible; } 
      .leaflet-control-container { display: none; }
      
      @keyframes float-marker { 0% { transform: translateY(0px); } 50% { transform: translateY(-4px); } 100% { transform: translateY(0px); } }
      .animate-float { animation: float-marker 3s ease-in-out infinite; }

      @keyframes map-ripple-severe { 0% { transform: scale(0.3); opacity: 1; box-shadow: 0 0 20px rgba(244,63,94,0.4); } 100% { transform: scale(3.5); opacity: 0; box-shadow: 0 0 0px rgba(244,63,94,0); } }
      @keyframes map-ripple-moderate { 0% { transform: scale(0.3); opacity: 1; box-shadow: 0 0 15px rgba(251,191,36,0.4); } 100% { transform: scale(3.0); opacity: 0; box-shadow: 0 0 0px rgba(251,191,36,0); } }
      @keyframes map-ripple-calm { 0% { transform: scale(0.3); opacity: 1; box-shadow: 0 0 10px rgba(52,211,153,0.4); } 100% { transform: scale(2.5); opacity: 0; box-shadow: 0 0 0px rgba(52,211,153,0); } }
      @keyframes map-ripple-event { 0% { transform: scale(0.3); opacity: 1; box-shadow: 0 0 30px rgba(147,51,234,0.6); } 100% { transform: scale(4.0); opacity: 0; box-shadow: 0 0 0px rgba(147,51,234,0); } }

      .hide-scrollbar::-webkit-scrollbar { display: none; }
      .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

      .marker-transition-wrapper { position: relative; transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; padding-bottom: 12px; pointer-events: auto; }
      .marker-main-box { position: relative; overflow: hidden; box-sizing: border-box; transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); backdrop-filter: blur(16px); -webkit-backdrop-filter: blur(16px); transform-origin: bottom center; }
      .lod-content { position: absolute; top: 0; left: 0; right: 0; bottom: 0; transition: opacity 0.4s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 0; pointer-events: none; display: flex; }
      
      .pulse-container { transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); opacity: 1; transform: scale(1); }
      .lod-state-0 .pulse-container { opacity: 0 !important; transform: scale(0.5) !important; pointer-events: none; }

      .lod-state-0 .marker-main-box { width: var(--icon-size); height: var(--icon-size); border-radius: 50%; background: var(--bg-0); border: var(--border-0); box-shadow: var(--shadow-0); }
      .lod-state-0 .content-icon { opacity: 1; pointer-events: auto; transform: scale(1); }
      .lod-state-0 .content-pill, .lod-state-0 .content-card, .lod-state-0 .marker-triangle { opacity: 0; transform: scale(0.8); }
      
      .lod-state-1 .marker-main-box { width: 190px; height: 48px; border-radius: 16px; background: var(--bg-1); border: 1.5px solid rgba(255,255,255,0.8); box-shadow: 0 10px 24px rgba(0,0,0,0.1); }
      .lod-state-1 .content-icon, .lod-state-1 .content-card { opacity: 0; transform: scale(0.8); }
      .lod-state-1 .content-pill { opacity: 1; pointer-events: auto; transform: scale(1); display: flex; }
      .lod-state-1 .marker-triangle { opacity: 1; transform: scale(1); border-top-color: rgba(255,255,255,0.9); }
      
      .lod-state-2 .marker-main-box { width: 220px; height: 238px; border-radius: 20px; background: var(--bg-2); border: 1.5px solid rgba(255,255,255,1); box-shadow: 0 16px 32px rgba(0,0,0,0.12); }
      .lod-state-2 .content-icon, .lod-state-2 .content-pill { opacity: 0; transform: scale(1.2); }
      .lod-state-2 .content-card { opacity: 1; pointer-events: auto; transform: scale(1); display: flex; }
      .lod-state-2 .marker-triangle { opacity: 1; transform: scale(1); border-top-color: rgba(255,255,255,0.98); }
    `;
    document.head.appendChild(style);
  }, []);

  useEffect(() => {
    if (leafletLoaded && mapRef.current && !mapInstance.current) {
      const L = window.L;
      const map = L.map(mapRef.current, { zoomControl: false, attributionControl: false }).setView([30.8760, 120.4220], 13.5); 
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { subdomains: 'abcd', maxZoom: 19 }).addTo(map);
      mapInstance.current = map;

      map.on('zoomend', () => {
        const currentZoom = map.getZoom();
        if (currentZoom <= 14.2) setZoomLod(0);
        else if (currentZoom > 14.2 && currentZoom <= 15.5) setZoomLod(1);
        else setZoomLod(2);
      });
    }
  }, [leafletLoaded]);

  const handleEventDrop = (e, info) => {
    if (info.offset.x < -100) acceptDynamicRoute();
  };

  const acceptDynamicRoute = () => {
    setIsTimelineMode(false);
    setIsAiGenerating(true);
    setTimeout(() => {
      const newCards = [...cards];
      newCards.unshift(pendingDynamicEvent);
      setCards(newCards);
      setPendingDynamicEvent(null);
      setIsAiGenerating(false);
      setRouteUpdatedToast(true);
      setTimeout(() => setRouteUpdatedToast(false), 3000);
      safeFlyTo(30.8750, 120.4245, 15.8, { duration: 1.5 });
    }, 800);
  };

  const rejectDynamicRoute = () => {
    setIsTimelineMode(false);
    setPendingDynamicEvent(null);
  };

  const handleSimulatedSearch = () => {
    if (!searchQuery.trim()) return;
    setIsAiGenerating(true);
    setCards([]); 
    setIsMapMode(false); 
    const intent = parseIntent(searchQuery);
    setTimeout(() => {
      let baseData = [...(mockDatabase[intent.task] || mockDatabase["想逛逛"])];
      if (intent.filter) baseData.sort((a, b) => (b.filterTags?.includes(intent.filter) ? 1 : 0) - (a.filterTags?.includes(intent.filter) ? 1 : 0));
      setCurrentTask(intent.task);
      setCurrentFilter(intent.filter);
      setCards(baseData);
      setIsAiGenerating(false);
      setSearchQuery(""); 
    }, 1200); 
  };

  const triggerGenAIFlow = (newTask, newFilter) => {
    setCards([]); 
    setIsAiGenerating(true);
    setIsMapMode(false); 
    setTimeout(() => {
      let baseData = [...(mockDatabase[newTask] || mockDatabase["想逛逛"])];
      if (newFilter) baseData.sort((a, b) => (b.filterTags.includes(newFilter) ? 1 : 0) - (a.filterTags.includes(newFilter) ? 1 : 0));
      setCards(baseData);
      setIsAiGenerating(false);
      if (mapInstance.current && mapInstance.current.getSize().x > 0) {
        mapInstance.current.setZoom(13.5); 
      }
    }, 800);
  };

  const handleDragEnd = (event, info, card) => {
    const swipeThreshold = 80;
    if (info.offset.x > swipeThreshold) {
      setSwipeFeedback('like');
      setSavedCards(prev => prev.find(c => c.id === card.id) ? prev : [...prev, card]);
      removeTopCard(card.id);
    } else if (info.offset.x < -swipeThreshold) {
      setSwipeFeedback('pass');
      removeTopCard(card.id);
    }
  };

  const removeTopCard = (id) => {
    setCards(prev => prev.filter(c => c.id !== id));
    setTimeout(() => setSwipeFeedback(null), 600); 
  };

  useEffect(() => {
    if (!leafletLoaded || !mapInstance.current || cards.length === 0 || isAiGenerating) return;
    const L = window.L;
    const map = mapInstance.current;
    
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];
    if (polylineRef.current) map.removeLayer(polylineRef.current);

    const validCards = cards.filter(c => Array.isArray(c.pos) && c.pos.length === 2 && typeof c.pos[0] === 'number' && typeof c.pos[1] === 'number' && !isNaN(c.pos[0]) && !isNaN(c.pos[1]));
    if (validCards.length === 0) return;

    if (!isMapMode) {
      const topLat = validCards[0].pos[0] + 0.0035;
      const topLng = validCards[0].pos[1];
      safeFlyTo(topLat, topLng, 14.5, { duration: 1.2, easeLinearity: 0.25 });
    }

    const corePathCards = validCards.slice(0, 5); 
    if (corePathCards.length > 1) {
      const latlngs = corePathCards.map(c => [c.pos[0], c.pos[1]]);
      const realisticPath = buildRealisticRoute(latlngs).filter(p => Array.isArray(p) && p.length === 2 && typeof p[0] === 'number' && typeof p[1] === 'number' && !isNaN(p[0]) && !isNaN(p[1]));
      if (realisticPath.length > 1) {
        polylineRef.current = L.polyline(realisticPath, { color: activeTaskConfig.color, weight: 5, opacity: 0.8, dashArray: '10, 10', lineJoin: 'round' }).addTo(map);
      }
    }

    validCards.forEach((card, idx) => {
      const isTop = idx === 0;
      const isCore = idx < 5;
      const pulse = getPulseConfig(card);
      const mLat = card.pos[0];
      const mLng = card.pos[1];

      const isDynamic = card.category === "LIMITED EVENT";
      const themeColor = isDynamic ? "#9333ea" : activeTaskConfig.color;
      
      const circleSize = isCore ? '36px' : '22px';
      const iconSize = isCore ? '18px' : '11px';
      const bgColor0 = isCore ? themeColor : '#ffffff';
      const iconColor = isCore ? '#ffffff' : themeColor;
      const border0 = isCore ? `2px solid #ffffff` : `1.5px solid rgba(0,0,0,0.1)`;
      const shadow0 = isCore ? '0 8px 16px rgba(0,0,0,0.25)' : '0 2px 8px rgba(0,0,0,0.06)';
      const svgContent = getTaskSvg(isDynamic ? "LIMITED EVENT" : currentTask);
      
      const zIndex = isTop ? 1000 : (isDynamic ? 900 : (isCore ? 800 : 400 - idx));

      const highlightQuote = card.comments && card.comments.length > 0 ? card.comments[0] : (card.title || "");
      const tagsHtml = card.filterTags ? card.filterTags.slice(0, 3).map(tag => `<span style="background: #f1f5f9; color: ${themeColor}; padding: 2px 6px; border-radius: 4px; font-size: 9px; font-weight: 800; border: 1px solid #e2e8f0;">${tag}</span>`).join('') : '';
      const forcedLod = isCore ? zoomLod : 0;

      const htmlString = `
        <div class="animate-float marker-transition-wrapper lod-state-${forcedLod}" style="z-index: ${zIndex};">
          <div class="pulse-container" style="position: absolute; bottom: 7px; left: 50%; width: 0px; height: 0px; display: flex; align-items: center; justify-content: center; z-index: 1;">
            ${isCore ? pulse.html : ''}
          </div>
          <div class="marker-main-box" style="--icon-size: ${circleSize}; --bg-0: ${bgColor0}; --border-0: ${border0}; --shadow-0: ${shadow0}; --bg-1: rgba(255,255,255,${isCore ? '0.95' : '0.65'}); --bg-2: rgba(255,255,255,${isCore ? '0.98' : '0.85'}); z-index: 10;">
            <div class="lod-content content-icon" style="justify-content: center; align-items: center; color: ${iconColor};">
              <div style="width: ${iconSize}; height: ${iconSize}; display: flex; align-items: center; justify-content: center;">${svgContent}</div>
              ${isCore && !isDynamic ? `<div style="position: absolute; top: -2px; right: -2px; width: 10px; height: 10px; border-radius: 50%; background: #f43f5e; border: 2px solid white;"></div>` : ''}
            </div>
            <div class="lod-content content-pill" style="align-items: center; gap: 8px; padding: 6px;">
              <img src="${card.image || ''}" style="width: 36px; height: 36px; border-radius: 12px; object-fit: cover; box-shadow: 0 2px 4px rgba(0,0,0,0.05); flex-shrink: 0;" />
              <div style="display: flex; flex-direction: column; justify-content: center; overflow: hidden;">
                <div style="font-size: 13px; font-weight: 900; color: #1e293b; line-height: 1.1; margin-bottom: 2px; text-overflow: ellipsis; white-space: nowrap; overflow: hidden;">
                  ${isDynamic ? `<span style="color: #9333ea; margin-right: 2px;">✨</span>` : ''}${String(card.name || "")}
                </div>
                <div style="display: flex; align-items: center; gap: 6px; font-size: 9px; font-weight: 800; color: #64748b; white-space: nowrap;">
                  <span style="color: #f59e0b; display: flex; align-items: center; gap: 1px;"><svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>${String(card.rating || "")}</span>
                  <span style="color: #cbd5e1;">|</span>
                  <span>${String(card.distance || "")}</span>
                  <span style="color: #cbd5e1;">|</span>
                  <span style="color: ${pulse.hex};">${String(card.waitTime || "")}</span>
                </div>
              </div>
            </div>
            <div class="lod-content content-card" style="flex-direction: column; gap: 6px; padding: 10px; width: 100%; box-sizing: border-box;">
              <div style="position: relative; width: 100%; height: 90px; border-radius: 14px; overflow: hidden; flex-shrink: 0;">
                <img src="${card.image || ''}" style="width: 100%; height: 100%; object-fit: cover;" />
                <div style="position: absolute; top: 6px; left: 6px; background: rgba(255,255,255,0.95); color: ${themeColor}; font-size: 9px; font-weight: 900; padding: 3px 6px; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">${String(card.ranking || "AI 推荐")}</div>
                <div style="position: absolute; bottom: 6px; right: 6px; background: rgba(0,0,0,0.65); backdrop-filter: blur(4px); color: white; font-size: 10px; font-weight: 800; padding: 3px 6px; border-radius: 6px; display: flex; align-items: center; gap: 3px;">
                   <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0 1 12 2a8 8 0 0 1 8 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></svg>
                   ${String(card.distance || "")}
                </div>
              </div>
              <div style="display: flex; flex-direction: column; gap: 4px;">
                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                    <div style="font-size: 15px; font-weight: 900; color: #1e293b; line-height: 1.2; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 140px;">${String(card.name || "")}</div>
                    <div style="font-size: 10px; font-weight: 900; color: #f59e0b; display: flex; align-items: center; gap: 2px; background: #fef3c7; padding: 2px 4px; border-radius: 4px;">★ ${String(card.rating || "")}</div>
                </div>
                <div style="display: flex; gap: 4px; flex-wrap: wrap;">${tagsHtml}</div>
                <div style="font-size: 11px; color: #475569; font-weight: 600; font-style: italic; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; line-height: 1.3; margin-top: 2px; background: #f8fafc; padding: 4px 6px; border-radius: 6px; border-left: 3px solid ${themeColor};">“${highlightQuote}”</div>
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 4px; margin-top: 2px; padding-top: 6px; border-top: 1px dashed #e2e8f0;">
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; color: ${pulse.hex};"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>${String(card.waitTime || "")}</div>
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; color: #64748b;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>${String(card.crowdTrend || "")}</div>
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; color: #64748b;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>${String(card.details?.price || "")}</div>
                  <div style="display: flex; align-items: center; gap: 4px; font-size: 9px; font-weight: 800; color: #64748b;"><svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>${String(card.details?.time?.split('-')[0] || "")} 营业</div>
                </div>
              </div>
            </div>
          </div>
          <div class="marker-triangle" style="position: absolute; bottom: 6px; width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; transform-origin: top center; transition: border-color 0.4s ease, transform 0.4s ease; z-index: 10;"></div>
          <div style="position: absolute; bottom: 0; width: 14px; height: 14px; background: ${themeColor}; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.2); z-index: 12;"></div>
        </div>
      `;
      
      const icon = L.divIcon({ className: 'leaflet-div-icon', html: htmlString, iconSize: [0, 0] });
      const marker = L.marker([mLat, mLng], { icon }).addTo(map);

      marker.on('click', (e) => {
        if (e.originalEvent) e.originalEvent.stopPropagation();
        setSelectedCard(card);
        setView('detail');
      });

      markersRef.current.push(marker);
    });
  }, [cards, leafletLoaded, activeTaskConfig.color, isAiGenerating, isMapMode]);

  useEffect(() => {
    markersRef.current.forEach(marker => {
      const el = marker.getElement();
      if (el) {
        const wrapper = el.querySelector('.marker-transition-wrapper');
        if (wrapper) {
          if (wrapper.classList.contains('lod-state-0') || wrapper.classList.contains('lod-state-1') || wrapper.classList.contains('lod-state-2')) {
             wrapper.classList.remove('lod-state-0', 'lod-state-1', 'lod-state-2');
             wrapper.classList.add(`lod-state-${zoomLod}`);
          }
        }
      }
    });
  }, [zoomLod]);


  return (
    <div className="relative w-full h-screen bg-slate-100 text-slate-900 overflow-hidden font-sans flex justify-center selection:bg-blue-200">
      <div className="relative w-full max-w-[430px] h-full shadow-2xl overflow-hidden bg-[#F5F7FA]">
        
        <div className="absolute inset-0 w-full h-full">
          <div className="absolute inset-0 z-0">
            <div ref={mapRef} className="w-full h-full" style={{ filter: 'contrast(1.05) brightness(1.02)' }} />
            <div className="absolute inset-0 bg-white/10 pointer-events-none" />
            
            {routeUpdatedToast && (
               <motion.div key="route-toast" initial={{ opacity: 0, y: -20, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="absolute top-[200px] left-1/2 -translate-x-1/2 bg-purple-600/90 backdrop-blur-md px-4 py-2 rounded-full shadow-2xl border border-purple-400 flex items-center gap-2 z-50 pointer-events-none">
                 <Zap size={14} className="text-yellow-300 fill-current" />
                 <span className="text-[11px] font-black text-white tracking-widest">已为您顺路加塞，将优先引导前往</span>
                 </motion.div>
            )}

            <AnimatePresence>
               {!isAiGenerating && cards.length > 0 && !routeUpdatedToast && zoomLod !== 0 && (
                 <motion.div key="route-tip" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="absolute top-[160px] left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-lg border border-slate-200 flex items-center gap-2 z-10 pointer-events-none">
                   <MapPin size={12} className="text-blue-600" />
                   <span className="text-[10px] font-black text-slate-700 tracking-wider">距离首选目标: {cards[0]?.distance || ''}</span>
                 </motion.div>
               )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {swipeFeedback && (
              <motion.div key="swipe-feedback" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 px-6 py-3 rounded-full backdrop-blur-md text-white font-black tracking-widest text-lg shadow-2xl flex items-center gap-2 ${swipeFeedback === 'like' ? 'bg-green-500/80 border border-green-400' : 'bg-slate-800/80 border border-slate-600'}`}>
                {swipeFeedback === 'like' ? <><Heart size={20} fill="currentColor" /> 已保留</> : <><X size={20} /> 过滤</>}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute top-0 left-0 w-full z-30 pt-12 pb-4 px-5 bg-gradient-to-b from-white/95 via-white/80 to-transparent pointer-events-auto">
            <div className="flex justify-between items-center mb-5">
              <div className="flex itzems-center gap-2.5">
                {/* ⭐️ 使用常规 img 标签直接引用路径，适用于本地开发 */}
                <img src={logoImg} alt="Moment Hunt Logo" className="h-6 w-auto drop-shadow-sm" />
                <h1 className="text-[12px] font-black tracking-[0.2em] text-slate-800 uppercase mt-0.5">Moment Hunt</h1>
              </div>
              <button onClick={() => setView('collection')} className="relative w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center shadow-lg active:scale-95 transition-transform">
                <Bookmark size={16} />
                {savedCards.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[9px] flex items-center justify-center font-bold border-2 border-slate-900">{savedCards.length}</span>}
              </button>
            </div>

            <div className="flex justify-between items-center gap-1.5 w-full">
              {mainTasks.map((task) => {
                const isActive = currentTask === task.id;
                return (
                  <motion.button
                    key={task.id} layout onClick={() => { setCurrentTask(task.id); setCurrentFilter(null); triggerGenAIFlow(task.id, null); }} initial={false}
                    animate={{ backgroundColor: isActive ? task.color : "#ffffff", flex: isActive ? 2 : 1 }} transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    className={`h-11 rounded-full flex items-center justify-center gap-1.5 shadow-sm border outline-none ${isActive ? "border-transparent text-white" : "border-slate-200 text-slate-400"}`}
                    style={{ minWidth: isActive ? 'auto' : '44px' }} 
                  >
                    <motion.div layout><task.icon size={16} className={isActive ? "text-white" : "text-slate-400"} /></motion.div>
                    <AnimatePresence>
                      {isActive && <motion.span key={`text-${task.id}`} initial={{ opacity: 0, width: 0 }} animate={{ opacity: 1, width: "auto" }} exit={{ opacity: 0, width: 0 }} className="text-[12px] font-bold whitespace-nowrap overflow-hidden ml-1">{task.id}</motion.span>}
                    </AnimatePresence>
                  </motion.button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2 mt-4 min-h-[28px]">
              <AnimatePresence mode="popLayout">
                {activeTaskConfig.filters.map((filter) => {
                  const isActive = currentFilter === filter;
                  return (
                    <motion.button
                      key={filter} layout initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                      onClick={() => { const newFilter = isActive ? null : filter; setCurrentFilter(newFilter); triggerGenAIFlow(currentTask, newFilter); }}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-bold tracking-wide transition-colors border ${isActive ? "bg-white text-slate-800 shadow-sm border-slate-300" : "bg-transparent text-slate-500 border-transparent hover:border-slate-200"}`}
                    >
                      <span style={{ color: isActive ? activeTaskConfig.color : 'inherit' }}>{isActive ? '✓ ' : ''}{filter}</span>
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <motion.div className="absolute right-5 z-50 pointer-events-auto transition-all duration-500" animate={{ bottom: zoomLod === 0 ? '290px' : (isMapMode ? '100px' : '150px') }} >
            <button onClick={() => setIsMapMode(!isMapMode)} className="flex items-center gap-2 bg-white/95 backdrop-blur-xl text-slate-800 px-4 py-3 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.12)] border border-slate-100 active:scale-95 transition-transform">
              {isMapMode ? <Layers size={16} className="text-slate-600" /> : <MapIcon size={16} className="text-slate-600" />}
              <span className="text-[12px] font-black tracking-widest">{isMapMode ? "选卡片" : "沉浸地图"}</span>
            </button>
          </motion.div>

          <motion.div className="absolute bottom-24 w-full px-5 z-40 pointer-events-none" animate={{ opacity: isMapMode ? 0 : 1, y: isMapMode ? 100 : 0 }} transition={{ duration: 0.4 }}>
            <AnimatePresence>
              {(isAiGenerating || currentFilter) && !isMapMode && zoomLod !== 0 && (
                <motion.div key="ai-tip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: [0, -3, 0] }} exit={{ opacity: 0, y: 10 }} transition={{ y: { repeat: Infinity, duration: 3 } }} className="bg-white/95 backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.05)] rounded-2xl p-3 flex items-center gap-3 relative w-[95%] border border-slate-100 mx-auto">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${isAiGenerating ? 'bg-slate-800' : ''}`} style={{ backgroundColor: !isAiGenerating ? activeTaskConfig.color : undefined }}>
                    <Sparkles size={14} className={`text-white ${isAiGenerating ? 'animate-spin' : ''}`} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold text-slate-700 leading-snug pr-2">
                      {isAiGenerating ? "正在结合条件通过模型分析环境..." : currentFilter ? `已为您优先匹配带有「${currentFilter}」属性的地点` : `已为您切换至最佳 [${currentTask}] 路线`}
                    </p>
                  </div>
                  <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white rotate-45 border-r border-b border-slate-100" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            className="absolute top-0 left-0 w-full h-full z-20 flex items-start justify-center px-4 pt-[200px] pointer-events-none"
            animate={{ y: isMapMode || isTimelineMode || zoomLod === 0 ? 800 : 0, opacity: isMapMode || isTimelineMode || zoomLod === 0 ? 0 : 1 }} transition={{ duration: 0.5, type: "spring", bounce: 0.15 }}
          >
            <div className={`relative w-full h-[450px] flex items-start justify-center ${isMapMode || isTimelineMode || zoomLod === 0 ? 'pointer-events-none' : 'pointer-events-auto'}`}>
              <AnimatePresence>
                {!isAiGenerating && cards.slice(0, 4).map((card, index) => {
                  const isTop = index === 0;
                  const transform = scatterTransforms[index] || scatterTransforms[3];
                  const pulse = getPulseConfig(card);

                  return (
                    <motion.div
                      key={card.id} drag={isTop ? "x" : false} dragConstraints={{ left: 0, right: 0 }} onDragEnd={(e, info) => handleDragEnd(e, info, card)}
                      initial={{ scale: 0.8, opacity: 0, y: 50 }} 
                      animate={{ scale: transform.scale, x: isTop ? 0 : transform.x, y: isTop ? 0 : transform.y, rotate: isTop ? 0 : transform.rotate, opacity: 1, zIndex: 20 - index }}
                      exit={{ x: swipeFeedback === 'like' ? 500 : -500, opacity: 0, rotate: swipeFeedback === 'like' ? 15 : -15, transition: { duration: 0.3 } }}
                      className="absolute w-[94%] h-[440px] bg-white rounded-[24px] flex flex-col origin-bottom cursor-grab active:cursor-grabbing shadow-xl"
                      style={{ WebkitMaskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.5) 100%)', maskImage: 'linear-gradient(to bottom, black 50%, rgba(0,0,0,0.5) 100%)' }}
                    >
                      <div className="relative w-full h-[50%] shrink-0 rounded-t-[24px] overflow-hidden bg-slate-100">
                        <img src={card.image} className="w-full h-full object-cover pointer-events-none" draggable={false} alt="cover" />
                        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/95 rounded-full shadow-sm"><span className="text-[10px] font-black uppercase tracking-wider" style={{ color: activeTaskConfig.color }}>{card.ranking || "AI 推介"}</span></div>
                        <div className="absolute top-4 right-4 px-3 py-1.5 bg-slate-900/80 rounded-full shadow-sm"><span className="text-[10px] font-black text-white tracking-wider">{card.match} 匹配</span></div>
                      </div>
                      <div className="relative flex flex-col flex-1 p-5 rounded-b-[24px] bg-white">
                        <div className="flex items-center gap-1.5 mb-2"><Sparkles size={14} className={pulse.textClass} /><span className={`text-[10px] font-black uppercase tracking-widest ${pulse.textClass}`}>实时洞察</span></div>
                        <h2 className="text-[20px] font-black leading-tight text-slate-800 mb-2 truncate">{card.category === "LIMITED EVENT" ? `✨ ${card.name}` : card.name}</h2>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed line-clamp-2 mb-auto">{card.desc}</p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
                           <div className="flex items-center gap-2.5">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-slate-50 text-slate-500`}><Clock size={14} /></div>
                              <div className="flex flex-col"><span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">排队状态</span><span className="text-[12px] font-black text-slate-800">{card.waitTime}</span></div>
                           </div>
                           <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl ${pulse.colorClass} text-white shadow-sm`}><Activity size={12} /><span className="text-[10px] font-bold tracking-wider">{card.crowdTrend}</span></div>
                        </div>
                        {isTop && <div className="absolute inset-0 z-20 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedCard(card); setView('detail'); }} />}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </motion.div>

          <AnimatePresence>
            {zoomLod === 0 && !isTimelineMode && (
              <motion.div
                key="macro-gallery"
                initial={{ y: 200, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 200, opacity: 0 }}
                transition={{ type: "spring", bounce: 0.2 }}
                className="absolute bottom-[85px] left-0 w-full z-40 pointer-events-auto"
              >
                 <div className="flex gap-3 px-5 overflow-x-auto snap-x snap-mandatory pb-4 hide-scrollbar">
                   {cards.slice(0, 15).map((card) => (
                      <div 
                        key={card.id} 
                        className="bg-white rounded-[20px] shadow-[0_8px_20px_rgba(0,0,0,0.08)] flex-shrink-0 w-[145px] snap-center cursor-pointer overflow-hidden border border-slate-100 active:scale-95 transition-transform"
                        onClick={() => { 
                          setSelectedCard(card); 
                          setView('detail'); 
                          if (mapInstance.current && card.pos && !isNaN(card.pos[0])) {
                            mapInstance.current.flyTo([card.pos[0], card.pos[1]], 15.5, { duration: 1.2 });
                          }
                        }}
                      >
                         <div className="relative w-full h-[100px]">
                           <img src={card.image} className="w-full h-full object-cover" alt={card.name} />
                           <div className="absolute top-2 right-2 bg-white/95 backdrop-blur-sm px-1.5 py-0.5 rounded shadow-sm">
                             {card.category === "LIMITED EVENT" ? (
                               <span className="text-[9px] font-black text-purple-600">限时高光</span>
                             ) : (
                               <span className="text-[9px] font-black" style={{ color: activeTaskConfig.color }}>
                                 {card.ranking?.includes('Top') ? 'HOT' : '推荐'}
                               </span>
                             )}
                           </div>
                         </div>
                         <div className="p-3 pt-2 bg-white">
                           <h4 className="text-[13px] font-black text-slate-800 truncate mb-0.5">
                             {card.category === "LIMITED EVENT" ? '✨ ' : ''}{card.name}
                           </h4>
                           <p className="text-[9px] font-medium text-slate-400 truncate mb-1.5">{card.desc}</p>
                           <div className="flex items-center gap-1">
                             <div className="flex text-rose-400 text-[10px] tracking-tighter">★★★★★</div>
                             <span className="text-[10px] font-bold text-slate-600 ml-0.5">{card.rating}</span>
                           </div>
                         </div>
                      </div>
                   ))}
                 </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {isTimelineMode && pendingDynamicEvent && (
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                className="absolute inset-0 z-[70] bg-slate-900/40 backdrop-blur-[3px] flex overflow-hidden"
              >
                <motion.div 
                  initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -100, opacity: 0 }} transition={{ type: "spring", damping: 20 }}
                  className="w-[140px] h-full flex flex-col justify-center pl-6 pt-10"
                >
                  <div className="flex flex-col items-center">
                    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-center z-10 w-[110px]">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-0.5 flex items-center justify-center gap-1"><Navigation size={10} /> 您的位置</p>
                      <p className="text-xs font-black text-slate-800 truncate">入口牌坊区</p>
                    </div>
                    <div className="w-[2px] h-10 bg-slate-300" />
                    <div className={`w-[120px] h-[80px] rounded-xl border-2 border-dashed ${isDraggingOrb ? 'border-purple-400 bg-purple-500/20 shadow-[0_0_20px_rgba(168,85,247,0.4)]' : 'border-slate-300 bg-slate-200/50'} flex flex-col items-center justify-center transition-all duration-300 z-0`}>
                       <GripHorizontal size={16} className={isDraggingOrb ? 'text-purple-300' : 'text-slate-400'} />
                       <span className={`text-[10px] font-black mt-1 ${isDraggingOrb ? 'text-purple-200' : 'text-slate-500'}`}>拖至此处顺路打卡</span>
                    </div>
                    <div className="w-[2px] h-10 bg-slate-300 relative">
                       <span className="absolute top-1/2 left-3 -translate-y-1/2 text-[10px] font-bold text-slate-200 bg-slate-800/50 px-1.5 rounded">{cards[0]?.routeTime || '15min'}</span>
                    </div>
                    <div className="bg-white/90 backdrop-blur-md px-3 py-2 rounded-xl shadow-lg border border-slate-200 text-center z-10 w-[110px]">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">🎯 目标地点</p>
                      <p className="text-xs font-black text-slate-800 truncate">{cards[0]?.name}</p>
                    </div>
                  </div>
                </motion.div>

                <motion.div 
                  initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 100, opacity: 0 }} transition={{ type: "spring", damping: 20 }}
                  className="flex-1 h-full flex flex-col justify-center items-center pr-6"
                >
                  <div className="text-center mb-6">
                    <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="bg-purple-600 text-white px-3 py-1.5 rounded-full text-[10px] font-black inline-flex items-center gap-1 shadow-lg shadow-purple-500/30 mb-2">
                      <Zap size={12} className="fill-current text-yellow-300" /> 发现限时高光
                    </motion.div>
                    <p className="text-white text-[12px] font-bold text-shadow-sm">向左拖拽加入行程</p>
                  </div>
                  <motion.div
                    drag dragSnapToOrigin dragConstraints={{ left: -180, right: 0, top: -100, bottom: 100 }}
                    onDragStart={() => setIsDraggingOrb(true)} onDragEnd={(e, info) => { setIsDraggingOrb(false); handleEventDrop(e, info); }}
                    whileDrag={{ scale: 1.05, rotate: -3 }}
                    className="relative w-[180px] cursor-grab active:cursor-grabbing"
                  >
                    <div className="absolute inset-0 bg-purple-500 rounded-[20px] blur-xl opacity-40 animate-pulse" />
                    <div className="relative bg-white/95 backdrop-blur-xl border border-purple-200 p-3 rounded-[20px] shadow-2xl flex flex-col gap-2">
                       <img src={pendingDynamicEvent.image} className="w-full h-[100px] object-cover rounded-[12px]" />
                       <div>
                         <h3 className="text-[14px] font-black text-slate-800 leading-tight">{pendingDynamicEvent.name}</h3>
                         <p className="text-[10px] font-bold text-purple-600 mt-0.5">{pendingDynamicEvent.details.time}</p>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                         <p className="text-[10px] text-slate-500 font-medium leading-tight line-clamp-2">极度符合您的偏好，现在顺路前往刚刚好。</p>
                       </div>
                    </div>
                  </motion.div>
                  <button onClick={rejectDynamicRoute} className="mt-8 text-white/60 text-[12px] font-bold underline underline-offset-2 hover:text-white transition-colors">
                    忽略本次推荐
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute bottom-6 w-full px-5 z-40 pointer-events-auto">
            <div className="bg-[#1C2033] shadow-2xl rounded-full h-14 flex items-center px-4 gap-2.5 mx-1 border border-slate-700/50">
              <Search size={18} className="text-slate-400 shrink-0 ml-1" />
              <input 
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSimulatedSearch()}
                placeholder="试试输入“我有点累”..." className="flex-1 bg-transparent border-none text-[14px] outline-none text-white placeholder:text-slate-400 font-medium"
              />
              <button className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white transition-colors"><Camera size={18} /></button>
              <button onClick={handleSimulatedSearch} className={`w-9 h-9 ${isAiGenerating ? 'bg-slate-600' : 'bg-[#3C4A8A]'} rounded-full flex items-center justify-center shadow-lg text-white hover:bg-blue-500 transition-colors active:scale-95`}>
                <Mic size={16} className={isAiGenerating ? "animate-pulse" : ""} />
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {view === 'detail' && selectedCard && (
            <motion.div
              key="detail-view"
              initial={{ x: '100%', opacity: 0.5 }} animate={{ x: 0, opacity: 1 }} exit={{ x: '100%', opacity: 0.5 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-[60] bg-slate-50 text-slate-800 flex flex-col overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex-1 overflow-y-auto pb-28">
                <div className="relative h-[300px] shrink-0">
                  <img src={selectedCard.image} alt="detail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-transparent" />
                  <button onClick={() => setView('home')} className="absolute top-10 left-5 w-10 h-10 bg-black/30 backdrop-blur-md rounded-full flex items-center justify-center text-white z-10 hover:bg-black/50 transition-colors"><ChevronLeft size={24} /></button>
                </div>

                <div className="p-6 bg-slate-50 -mt-8 rounded-t-3xl relative z-10 min-h-screen">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black text-slate-600 bg-white border border-slate-200 px-3 py-1 rounded-full tracking-wider shadow-sm">{selectedCard.ranking || selectedCard.category}</span>
                      <h1 className="text-2xl font-black mt-3 leading-tight">{selectedCard.name}</h1>
                    </div>
                    <div className="text-right flex flex-col items-end">
                      <span className="text-xl font-black" style={{ color: activeTaskConfig.color }}>{selectedCard.match}</span>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">AI 匹配度</p>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-2xl mb-4 border border-blue-50 shadow-sm relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: activeTaskConfig.color }} />
                    <div className="flex items-center gap-1.5 mb-2"><Sparkles size={14} style={{ color: activeTaskConfig.color }}/><span className="text-[10px] font-black uppercase tracking-widest" style={{ color: activeTaskConfig.color }}>AI 实时洞察</span></div>
                    <p className="text-sm text-slate-700 leading-relaxed font-medium">{selectedCard.desc}</p>
                  </div>

                  <div className="flex gap-3 mb-6">
                    {selectedCard.ticketPrice && (
                      <button className="flex-1 bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-sm hover:bg-orange-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-orange-100 text-orange-500 flex items-center justify-center"><Ticket size={16}/></div><div className="text-left"><p className="text-[10px] font-bold text-slate-400">官方门票</p><p className="text-sm font-black text-slate-800">{selectedCard.ticketPrice}</p></div></div>
                        <ChevronRightIcon />
                      </button>
                    )}
                    {selectedCard.hasStamp && (
                      <button className="flex-1 bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between shadow-sm hover:bg-purple-50 transition-colors cursor-pointer">
                        <div className="flex items-center gap-2"><div className="w-8 h-8 rounded-full bg-purple-100 text-purple-500 flex items-center justify-center"><Award size={16}/></div><div className="text-left"><p className="text-[10px] font-bold text-slate-400">活动系统</p><p className="text-sm font-black text-slate-800">点亮图鉴</p></div></div>
                        <ChevronRightIcon />
                      </button>
                    )}
                  </div>

                  <div className="mb-6 overflow-hidden">
                    <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-1.5"><MessageSquare size={14}/> 实时弹幕评价</h3>
                    <div className="flex gap-2 w-full overflow-hidden relative">
                      <motion.div animate={{ x: [0, -400] }} transition={{ repeat: Infinity, duration: 15, ease: "linear" }} className="flex gap-2 whitespace-nowrap">
                        {Array.isArray(selectedCard.comments) && [...selectedCard.comments, ...selectedCard.comments].map((cmt, i) => (
                          <div key={i} className="bg-white border border-slate-100 px-3 py-1.5 rounded-full text-[11px] font-medium text-slate-600 shadow-sm flex items-center gap-1.5">
                            <img src={`https://i.pravatar.cc/150?u=${i}`} className="w-4 h-4 rounded-full" alt="u"/> {cmt}
                          </div>
                        ))}
                      </motion.div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-24">
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center"><Clock size={14}/></div><div><p className="text-[9px] text-slate-400 font-bold uppercase">排队时间</p><p className="text-xs font-bold">{selectedCard.waitTime}</p></div></div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center"><Activity size={14}/></div><div><p className="text-[9px] text-slate-400 font-bold uppercase">人流动向</p><p className="text-xs font-bold text-orange-500">{selectedCard.crowdTrend}</p></div></div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center"><Route size={14}/></div><div><p className="text-[9px] text-slate-400 font-bold uppercase">前往路线</p><p className="text-xs font-bold">{selectedCard.routeTime}</p></div></div>
                    <div className="bg-white border border-slate-100 p-3 rounded-xl flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-slate-50 text-slate-500 flex items-center justify-center"><DollarSign size={14}/></div><div><p className="text-[9px] text-slate-400 font-bold uppercase">人均消费</p><p className="text-xs font-bold">{selectedCard.details?.price || ''}</p></div></div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-4 bg-white/90 backdrop-blur-xl border-t border-slate-100 z-50 flex gap-3 pb-8 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
                 <button onClick={() => { setSavedCards(prev => prev.find(c => c.id === selectedCard.id) ? prev : [...prev, selectedCard]); setView('home'); }} className="flex-1 py-3.5 bg-slate-900 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 shadow-xl hover:bg-slate-800 transition-colors">
                   <Bookmark size={16} /> 收藏地点
                 </button>
                 <button 
                   onClick={() => alert(`将为您打开本地地图导航至：[${selectedCard.pos[0]}, ${selectedCard.pos[1]}]`)}
                   className="w-[120px] py-3.5 text-white rounded-2xl font-black text-[13px] flex items-center justify-center gap-2 shadow-xl hover:opacity-90 transition-opacity"
                   style={{ backgroundColor: activeTaskConfig.color }}
                 >
                   <Navigation size={16} /> 导航
                 </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {view === 'collection' && (
            <motion.div
              key="collection-view"
              initial={{ y: '100%', opacity: 0.5 }} animate={{ y: 0, opacity: 1 }} exit={{ y: '100%', opacity: 0.5 }} transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="absolute inset-0 z-[60] bg-slate-50 text-slate-800 flex flex-col p-6 overflow-y-auto shadow-[0_-20px_40px_rgba(0,0,0,0.1)]"
            >
              <div className="flex items-center gap-4 mt-6 mb-8 shrink-0">
                <button onClick={() => setView('home')} className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center shadow-sm hover:bg-slate-100 transition-colors"><ChevronLeft size={20} /></button>
                <div><h1 className="text-xl font-black">我的行程簿</h1><p className="text-xs text-slate-400 font-bold mt-1">已保留 {savedCards.length} 个地点</p></div>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pb-10">
                {savedCards.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center opacity-40"><Bookmark size={48} className="mb-4" /><p className="text-sm font-bold tracking-widest">空空如也，快去右滑卡片吧</p></div>
                ) : savedCards.map(card => (
                  <div 
                    key={card.id} 
                    onClick={() => { setSelectedCard(card); setView('detail'); }}
                    className="bg-white p-3 rounded-2xl flex gap-4 shadow-sm border border-slate-100 items-center cursor-pointer hover:bg-slate-50 transition-colors"
                  >
                    <img src={card.image} alt={card.name} className="w-20 h-20 rounded-xl object-cover shrink-0 shadow-sm" />
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-black text-sm mb-1 truncate">{card.name}</h3>
                      <p className="text-[10px] text-slate-400 line-clamp-2 leading-relaxed">{card.desc}</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSavedCards(prev => prev.filter(c => c.id !== card.id)); }} 
                      className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center shrink-0 hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}