import React from 'react';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Search, Send, User } from 'lucide-react';
export function Messages() {
  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <Card className="w-80 flex flex-col">
        <div className="p-4 border-b border-slate-100">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
            <Input placeholder="Search messages..." className="pl-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {[1, 2, 3, 4].map((i) =>
          <div
            key={i}
            className="p-4 border-b border-slate-50 hover:bg-slate-50 cursor-pointer">
            
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">User {i}</span>
                <span className="text-xs text-slate-400">10:42 AM</span>
              </div>
              <p className="text-xs text-slate-500 truncate">
                Hey, I have a question about my recent order...
              </p>
            </div>
          )}
        </div>
      </Card>

      <Card className="flex-1 flex flex-col">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
            <User className="h-5 w-5 text-slate-400" />
          </div>
          <div>
            <h3 className="font-medium">User 1</h3>
            <p className="text-xs text-slate-500">Customer • Active now</p>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4">
          <div className="self-start max-w-[80%] bg-slate-100 rounded-2xl rounded-tl-none px-4 py-2 text-sm">
            Hey, I have a question about my recent order.
          </div>
          <div className="self-end max-w-[80%] bg-blue-600 text-white rounded-2xl rounded-tr-none px-4 py-2 text-sm">
            Hello! I'd be happy to help. What's your order number?
          </div>
        </div>

        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-2">
            <Input placeholder="Type a message..." className="flex-1" />
            <Button size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>);

}