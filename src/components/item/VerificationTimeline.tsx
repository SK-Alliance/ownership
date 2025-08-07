'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VerificationEvent } from '@/types/item';
import { 
  Clock, 
  Shield, 
  ShieldCheck, 
  ShieldX, 
  Users, 
  UserMinus,
  Calendar,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';

interface VerificationTimelineProps {
  events: VerificationEvent[];
}

export default function VerificationTimeline({ events }: VerificationTimelineProps) {
  const getEventIcon = (type: VerificationEvent['type']) => {
    switch (type) {
      case 'registered':
        return <Shield className="w-4 h-4" />;
      case 'verified':
        return <ShieldCheck className="w-4 h-4" />;
      case 'rejected':
        return <ShieldX className="w-4 h-4" />;
      case 'co_owner_added':
        return <Users className="w-4 h-4" />;
      case 'co_owner_removed':
        return <UserMinus className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: VerificationEvent['type']) => {
    switch (type) {
      case 'verified':
        return 'text-green bg-green/20 border-green/30';
      case 'rejected':
        return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'co_owner_added':
        return 'text-blue bg-blue/20 border-blue/30';
      case 'co_owner_removed':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      default:
        return 'text-gold bg-gold/20 border-gold/30';
    }
  };

  const getStatusIcon = (type: VerificationEvent['type']) => {
    switch (type) {
      case 'verified':
        return <CheckCircle className="w-5 h-5 text-green" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gold" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatActor = (actor?: string) => {
    if (!actor) return null;
    return `${actor.slice(0, 6)}...${actor.slice(-4)}`;
  };

  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: 'easeOut' }}
    >
      <Card 
        className="relative border border-main/20 overflow-hidden backdrop-blur-xl"
        style={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%, 
            rgba(255, 255, 255, 0.03) 30%, 
            rgba(255, 255, 255, 0.01) 70%,
            transparent 100%
          )`
        }}
      >
        {/* Glass morphism overlay */}
        <div 
          className="absolute inset-0"
          style={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.1) 0%, 
              rgba(255, 255, 255, 0.05) 50%, 
              transparent 100%
            )`,
            backdropFilter: 'blur(20px)'
          }}
        />

        {/* Top highlight edge */}
        <div 
          className="absolute top-0 left-4 right-4 h-px"
          style={{
            background: `linear-gradient(90deg, 
              transparent, 
              rgba(255, 255, 255, 0.2), 
              transparent
            )`
          }}
        />

        <div className="relative z-10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gold" />
              <CardTitle className="text-xl font-clash text-main">
                Verification Timeline
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent>
            {sortedEvents.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-muted/50 mx-auto mb-3" />
                <p className="text-muted">No verification events yet</p>
              </div>
            ) : (
              <div className="space-y-6">
                {sortedEvents.map((event, index) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    {/* Timeline connector */}
                    {index < sortedEvents.length - 1 && (
                      <div className="absolute left-6 top-12 w-px h-8 bg-main/20" />
                    )}

                    <div className="flex gap-4">
                      {/* Event Icon */}
                      <div className="flex-shrink-0">
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${getEventColor(event.type)}`}>
                            {getEventIcon(event.type)}
                          </div>
                          {/* Status indicator */}
                          <div className="absolute -bottom-1 -right-1">
                            {getStatusIcon(event.type)}
                          </div>
                        </div>
                      </div>

                      {/* Event Content */}
                      <div className="flex-1 min-w-0">
                        <div className="bg-main/5 border border-main/10 rounded-lg p-4 hover:bg-main/8 transition-colors duration-200">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h4 className="font-medium text-main mb-1">
                                {event.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                              </h4>
                              <p className="text-sm text-muted leading-relaxed">
                                {event.description}
                              </p>
                            </div>
                            <Badge 
                              variant="outline" 
                              className={`${getEventColor(event.type)} text-xs font-medium border`}
                            >
                              {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                            </Badge>
                          </div>

                          {/* Event Details */}
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              <span>{formatDate(event.date)}</span>
                            </div>
                            {event.actor && (
                              <div className="flex items-center gap-1">
                                <span>by</span>
                                <code className="bg-main/10 px-1.5 py-0.5 rounded font-mono">
                                  {formatActor(event.actor)}
                                </code>
                              </div>
                            )}
                          </div>

                          {/* Additional Details */}
                          {event.details && Object.keys(event.details).length > 0 && (
                            <div className="mt-3 pt-3 border-t border-main/10">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {Object.entries(event.details).map(([key, value]) => (
                                  <div key={key} className="flex justify-between items-center">
                                    <span className="text-xs text-muted capitalize">
                                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                                    </span>
                                    <span className="text-xs text-main font-medium">
                                      {typeof value === 'string' ? value : JSON.stringify(value)}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}
