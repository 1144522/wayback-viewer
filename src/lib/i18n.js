import { writable } from 'svelte/store';

export const lang = writable('zh');

export const translations = {
  en: {
    title: 'View Snapshot List',
    inputPlaceholder: 'Please enter URL',
    getSnapshot: 'Get Snapshot',
    gettingSnapshot: 'Getting snapshot, please wait',
    getOtherSnapshot: 'Get other snapshots',
    snapshotContent: 'Snapshot Content:',
    sourceFrom: 'Snapshot content sourced from',
    share: 'Share',
    noContent: 'No content available',
    viewArea: 'Content viewing area below',
    viewWebSnapshot: 'View Web Snapshot',
     fetchSnapshotsFailed: "Failed to fetch snapshot list",
    linkCopied: "Link copied to clipboard",  
    shareModeTip: "In share mode, you can't view the  list. click the button below to get other snapshots.",
    getOtherSnapshot: "Get Other Snapshots"
  },
  zh: {
    title: '查看快照列表',
    inputPlaceholder: '请输入URL',
    getSnapshot: '获取快照',
    gettingSnapshot: '正在获取，请稍候',
    getOtherSnapshot: '获取其他快照',
    snapshotContent: '快照内容：',
    sourceFrom: '快照内容来源于',
    share: '分享',
    noContent: '暂无内容',
    viewArea: '以下为内容查看区域',
    viewWebSnapshot: '查看网页快照',
    fetchSnapshotsFailed: "获取快照列表失败",
    linkCopied: "链接已复制到剪贴板",
    shareModeTip: "分享模式下无法查看。请点击下方按钮获取其他快照。",
    getOtherSnapshot: "获取其他快照"
  }
};