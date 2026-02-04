import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { date: '01/01', precisao: 60, tempo: 45 },
  { date: '05/01', precisao: 50, tempo: 55 },
  { date: '10/01', precisao: 75, tempo: 40 },
  { date: '15/01', precisao: 68, tempo: 48 },
  { date: '20/01', precisao: 82, tempo: 35 },
  { date: '25/01', precisao: 78, tempo: 42 },
  { date: '30/01', precisao: 85, tempo: 32 },
];

export function EvolutionChart() {
  return (
    <div className="bg-card rounded-[20px] p-6 lg:p-8 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05)] mb-8">
      <h2 className="text-foreground mb-6">Evolução</h2>
      
      <div className="w-full h-[300px] lg:h-[350px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis 
              dataKey="date" 
              stroke="#94A3B8"
              style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-body)' }}
            />
            <YAxis 
              stroke="#94A3B8"
              style={{ fontSize: '0.875rem', fontFamily: 'var(--font-family-body)' }}
              label={{ value: '%', position: 'insideLeft', style: { fill: '#94A3B8' } }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--color-card)',
                border: '1px solid rgba(148, 163, 184, 0.2)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                fontFamily: 'var(--font-family-body)'
              }}
              labelStyle={{ color: 'var(--color-foreground)', fontWeight: 500 }}
            />
            <Legend 
              wrapperStyle={{ 
                fontSize: '0.875rem',
                fontFamily: 'var(--font-family-body)',
                paddingTop: '20px'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="precisao" 
              stroke="#2DD4BF" 
              strokeWidth={3}
              dot={{ fill: '#2DD4BF', r: 5 }}
              activeDot={{ r: 7 }}
              name="Precisão"
            />
            <Line 
              type="monotone" 
              dataKey="tempo" 
              stroke="#10B981" 
              strokeWidth={3}
              dot={{ fill: '#10B981', r: 5 }}
              activeDot={{ r: 7 }}
              name="Tempo Médio"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
