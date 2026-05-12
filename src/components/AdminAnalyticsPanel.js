import React from 'react';
import { formatDateAl } from '../utils/helpers';

const AdminAnalyticsPanel = ({ showAdmin, userProfile, analyticsOpen, darkMode, analyticsLoading, analyticsData, fetchAnalytics, articles }) => {
    if (!showAdmin || !userProfile?.is_admin || !analyticsOpen) return null;
    return (
        <div className={`fixed bottom-6 right-24 z-40 w-80 md:w-96 max-h-[80vh] overflow-y-auto rounded-2xl shadow-2xl border animate-fadeIn ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'}`}>
            <div className={`sticky top-0 flex items-center justify-between px-5 py-4 border-b ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-100'}`}>
                <span className={`font-bold text-base ${darkMode ? 'text-white' : 'text-gray-900'}`}>Analitika — 7 ditët e fundit</span>
                <button
                    onClick={() => fetchAnalytics()}
                    className={`text-xs px-3 py-1 rounded-lg transition-colors ${darkMode ? 'bg-gray-800 text-gray-400 hover:bg-gray-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                >
                    Rifresko
                </button>
            </div>

            {analyticsLoading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : analyticsData ? (() => {
                const pvs = analyticsData.pageViews;
                const ars = analyticsData.articleReads;

                const totalViews = pvs.length;
                const uniqueSessions = new Set(pvs.map(v => v.session_id)).size;
                const totalReads = ars.length;
                const durations = ars.map(r => r.read_duration_seconds).filter(d => d > 0);
                const avgDuration = durations.length > 0 ? durations.reduce((a, b) => a + b, 0) / durations.length : 0;
                const avgMin = Math.floor(avgDuration / 60);
                const avgSec = Math.round(avgDuration % 60);
                const avgLabel = avgMin > 0 ? `${avgMin} min ${avgSec} sek` : `${avgSec} sek`;

                const pageCount = {};
                pvs.forEach(v => { pageCount[v.page] = (pageCount[v.page] || 0) + 1; });
                const pagesSorted = Object.entries(pageCount).sort((a, b) => b[1] - a[1]);

                const artCount = {};
                ars.forEach(r => { artCount[r.article_id] = (artCount[r.article_id] || 0) + 1; });
                const artsSorted = Object.entries(artCount).sort((a, b) => b[1] - a[1]).slice(0, 10);

                const dayCount = {};
                pvs.forEach(v => {
                    const day = v.created_at.slice(0, 10);
                    dayCount[day] = (dayCount[day] || 0) + 1;
                });
                const daysSorted = Object.entries(dayCount).sort((a, b) => a[0].localeCompare(b[0]));
                const maxDayViews = Math.max(...daysSorted.map(d => d[1]), 1);

                return (
                    <div className="p-5 space-y-6">
                        <div className="grid grid-cols-2 gap-3">
                            {[
                                { value: totalViews, label: 'Vizita gjithsej' },
                                { value: uniqueSessions, label: 'Vizitorë unikë' },
                                { value: totalReads, label: 'Artikuj të lexuar' },
                                { value: avgLabel, label: 'Kohë mesatare' },
                            ].map(({ value, label }) => (
                                <div key={label} className={`rounded-xl p-4 text-center ${darkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                    <p className="text-2xl font-bold text-amber-500">{value}</p>
                                    <p className={`text-xs uppercase tracking-wider mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-5">
                            <div>
                                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Faqet më të vizituara</p>
                                {pagesSorted.length === 0 ? (
                                    <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nuk ka të dhëna.</p>
                                ) : pagesSorted.map(([page, count]) => (
                                    <div key={page} className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                        <span className={`text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>{page}</span>
                                        <span className="text-sm font-bold text-amber-500">{count}</span>
                                    </div>
                                ))}
                            </div>

                            <div>
                                <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Artikujt më të lexuar</p>
                                {artsSorted.length === 0 ? (
                                    <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nuk ka të dhëna.</p>
                                ) : artsSorted.map(([articleId, count]) => {
                                    const art = articles.find(a => String(a.id) === String(articleId));
                                    return (
                                        <div key={articleId} className={`flex justify-between items-center py-2 border-b ${darkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                                            <span className={`text-sm font-medium truncate pr-3 max-w-[70%] ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                {art ? art.titleAl : `Artikull #${articleId}`}
                                            </span>
                                            <span className="text-sm font-bold text-amber-500 flex-shrink-0">{count}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div>
                            <p className={`text-sm font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Vizita ditore</p>
                            {daysSorted.length === 0 ? (
                                <p className={`text-xs italic ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nuk ka të dhëna.</p>
                            ) : daysSorted.map(([day, count]) => (
                                <div key={day} className="flex items-center gap-3 mb-2">
                                    <span className={`text-xs w-20 flex-shrink-0 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{formatDateAl(day)}</span>
                                    <div className="flex-1 flex items-center gap-2">
                                        <div
                                            className="h-3 bg-amber-400 rounded-full"
                                            style={{ width: `${Math.round((count / maxDayViews) * 100)}%`, minWidth: '4px' }}
                                        />
                                        <span className={`text-xs font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>{count}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })() : (
                <p className={`text-xs text-center py-8 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`}>Nuk ka të dhëna.</p>
            )}
        </div>
    );
};

export default AdminAnalyticsPanel;
