// File will focus on the user learning a new skill
// The goal is to help the user set aside hours in their week to learn a new skill and track their progress
// Tracking their progress done entirely by user input, rating themselves?
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TenKGoals() {
  return (
    <div>
      <div>
        <h2 className="text-[24px] font-bold">10K Goals</h2>
        <p>Track your progress in learning a new skill.</p>
      </div>
      <div>
        <p>Set aside hours in your week to focus on learning your new skill and rate your progress regularly.</p>
        <div className="flex gap-2 m-4">
          <input type="number" placeholder="Hours per week" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
        </div>
        <div className="flex gap-2 m-4">
          <input type="text" placeholder="Subject" />
          <button className="bg-blue-500 text-white px-4 py-2 rounded">Appoint</button>
        </div>
      </div>
      <div>
        <p>Track your weekly progress here.</p>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={[{ week: 'Week 1', progress: 3 }, { week: 'Week 2', progress: 5 }]}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="week" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="progress" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}