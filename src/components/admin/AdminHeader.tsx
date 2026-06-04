interface Props { title: string; subtitle?: string; action?: React.ReactNode; }
export default function AdminHeader({ title, subtitle, action }: Props) {
  return (
    <div className="bg-gray-900 border-b border-gray-800 px-6 py-4 flex items-center justify-between flex-shrink-0">
      <div>
        <h1 className="text-white font-bold text-lg leading-tight">{title}</h1>
        {subtitle && <p className="text-gray-400 text-xs mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
