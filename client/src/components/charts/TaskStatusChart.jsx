import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

export default function TaskStatusChart({ data = [], dataKey = 'value', labelKey = 'name', colors = [], height = 260 }) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey={dataKey}
            nameKey={labelKey}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={3}
            strokeWidth={2}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: '0.75rem',
              border: '1px solid #e5e7eb',
              fontSize: '0.875rem',
            }}
          />
          <Legend iconType="circle" iconSize={9} wrapperStyle={{ fontSize: '0.8rem' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}