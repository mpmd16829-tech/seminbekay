import React from 'react';
import { InvitationCardData, InvitationCategory } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import {
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  CheckCircle2,
  Clock,
  Cloud,
  Check,
  PieChart as PieIcon,
  BarChart2
} from 'lucide-react';

interface InvitationStatsDashboardProps {
  invitations: InvitationCardData[];
  isCloudConnected: boolean;
  onFilterCategory?: (category: InvitationCategory | 'all') => void;
}

export const InvitationStatsDashboard: React.FC<InvitationStatsDashboardProps> = ({
  invitations,
  isCloudConnected,
}) => {
  const totalInvitations = invitations.length;
  const checkedInCount = invitations.filter((i) => i.checkedIn).length;
  const pendingCount = totalInvitations - checkedInCount;
  const checkInRate = totalInvitations > 0 ? Math.round((checkedInCount / totalInvitations) * 100) : 0;

  // Category counts
  const categoryCounts: Record<InvitationCategory, number> = {
    vip: 0,
    guest: 0,
    resident: 0,
    volunteer: 0,
    youth: 0,
    partner: 0,
  };

  invitations.forEach((inv) => {
    if (categoryCounts[inv.category] !== undefined) {
      categoryCounts[inv.category]++;
    } else {
      categoryCounts.guest++;
    }
  });

  const categoryLabels: Record<InvitationCategory, { fr: string; ar: string; color: string }> = {
    vip: { fr: 'Officiels & VIP', ar: 'ضيوف الشرف', color: '#c99837' },
    guest: { fr: 'Invités Spéciaux', ar: 'ضيوف خاصون', color: '#112d6a' },
    youth: { fr: 'Jeunes & Sportifs', ar: 'الشباب والرياضيون', color: '#005a2b' },
    volunteer: { fr: 'Bénévoles', ar: 'المتطوعون', color: '#10b981' },
    resident: { fr: 'Habitants & Familles', ar: 'أهالي القرى', color: '#f59e0b' },
    partner: { fr: 'Partenaires & Notables', ar: 'الشركاء والوجهاء', color: '#8b5cf6' },
  };

  const chartData = [
    {
      key: 'vip',
      name: 'Officiels & VIP',
      nameAr: 'ضيوف شرف',
      count: categoryCounts.vip,
      color: categoryLabels.vip.color,
    },
    {
      key: 'guest',
      name: 'Invités Spéciaux',
      nameAr: 'ضيوف',
      count: categoryCounts.guest,
      color: categoryLabels.guest.color,
    },
    {
      key: 'youth',
      name: 'Jeunes & Sport',
      nameAr: 'الشباب',
      count: categoryCounts.youth,
      color: categoryLabels.youth.color,
    },
    {
      key: 'volunteer',
      name: 'Bénévoles',
      nameAr: 'متطوعون',
      count: categoryCounts.volunteer,
      color: categoryLabels.volunteer.color,
    },
    {
      key: 'resident',
      name: 'Habitants',
      nameAr: 'سكان القرى',
      count: categoryCounts.resident,
      color: categoryLabels.resident.color,
    },
    {
      key: 'partner',
      name: 'Partenaires',
      nameAr: 'شركاء',
      count: categoryCounts.partner,
      color: categoryLabels.partner.color,
    },
  ];

  const pieData = chartData.filter((d) => d.count > 0);

  const statusPieData = [
    { name: 'Entrées Validées (QR)', nameAr: 'تم التحقق', value: checkedInCount, color: '#10b981' },
    { name: 'En Attente / Confirmés', nameAr: 'في الانتظار', value: pendingCount, color: '#c99837' },
  ].filter((d) => d.value > 0);

  return (
    <div className="space-y-6">
      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Total Cards */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Total Invitations</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-300">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalInvitations}</span>
            <span className="text-xs text-stone-400 ml-1">cartes</span>
          </div>
          <p dir="rtl" className="text-[11px] text-amber-300/80 font-arabic mt-1">
            إجمالي الدعوات الصادرة
          </p>
        </div>

        {/* Validated Access */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Pass Validés (QR)</span>
            <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{checkedInCount}</span>
            <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
              {checkInRate}%
            </span>
          </div>
          <p dir="rtl" className="text-[11px] text-emerald-300 font-arabic mt-1">
            تأكيدات الحضور الفعلي
          </p>
        </div>

        {/* VIP Count */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">VIP & Officiels</span>
            <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-300">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-2xl sm:text-3xl font-black text-amber-300">{categoryCounts.vip}</span>
            <span className="text-xs text-stone-400 ml-1">officiels</span>
          </div>
          <p dir="rtl" className="text-[11px] text-amber-300/80 font-arabic mt-1">
            ضيوف الشرف والمنصة
          </p>
        </div>

        {/* Cloud Status */}
        <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-col justify-between shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-400">Cloud Firebase</span>
            <div className={`p-1.5 rounded-lg ${isCloudConnected ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
              <Cloud className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <span className={`w-2.5 h-2.5 rounded-full ${isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="text-xs font-extrabold text-white">
              {isCloudConnected ? 'Synchronisé' : 'Cache Local'}
            </span>
          </div>
          <p dir="rtl" className="text-[11px] text-stone-400 font-arabic mt-1">
            {isCloudConnected ? 'متزامن سحابياً وآمن' : 'متاح محلياً بدون إنترنت'}
          </p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Recharts Bar Chart: Distribution by Category */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">
                Répartition des Participants par Catégorie
              </h3>
            </div>
            <span dir="rtl" className="text-xs font-arabic text-amber-300">
              توزيع المدعوين حسب الفئة
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#a8a29e', fontSize: 10 }}
                  angle={-20}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis allowDecimals={false} tick={{ fill: '#a8a29e', fontSize: 11 }} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-2.5 rounded-xl bg-stone-950 border border-amber-400/50 shadow-xl text-xs text-white">
                          <p className="font-bold text-amber-300">{data.name}</p>
                          <p dir="rtl" className="font-arabic text-stone-300">{data.nameAr}</p>
                          <p className="mt-1 text-sm font-black text-emerald-400">
                            {data.count} participant{data.count > 1 ? 's' : ''}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 pt-3 border-t border-stone-800 flex flex-wrap gap-2 justify-center">
            {chartData.map((cat) => (
              <div key={cat.key} className="flex items-center gap-1.5 text-[11px] text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                <span>{cat.name}: <strong>{cat.count}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Recharts Donut Pie Chart: Category Share & Status */}
        <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 flex flex-col shadow-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">
                Proportion & Statut d'Accès
              </h3>
            </div>
            <span dir="rtl" className="text-xs font-arabic text-emerald-300">
              النسب المئوية وحالة الحضور
            </span>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={3}
                    dataKey="count"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`pie-cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        const pct = totalInvitations > 0 ? ((data.count / totalInvitations) * 100).toFixed(1) : 0;
                        return (
                          <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-700 shadow-xl text-xs text-white">
                            <p className="font-bold text-amber-300">{data.name}</p>
                            <p className="text-emerald-400 font-bold">{data.count} ({pct}%)</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend
                    formatter={(value) => <span className="text-[11px] text-stone-300">{value}</span>}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-center text-stone-500 text-xs py-10">
                Aucune invitation pour le moment.
              </div>
            )}
          </div>

          {/* Attendance progress bar */}
          <div className="mt-2 pt-3 border-t border-stone-800">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-stone-400">Taux de validation des entrées au festival :</span>
              <span className="font-bold text-emerald-400">{checkedInCount} / {totalInvitations} ({checkInRate}%)</span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-stone-950 overflow-hidden border border-stone-800">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(checkInRate, 2)}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
