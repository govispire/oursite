import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Hash, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import { Article } from './types';
import { useReadingProgress } from '@/hooks/useReadingProgress';

export interface TopicViewDialogProps {
  articles: Article[] | null;
  topicName: string;
  onClose: () => void;
  onArticleClick?: (article: Article) => void;
}

export const TopicViewDialog: React.FC<TopicViewDialogProps> = ({
  articles,
  topicName,
  onClose,
  onArticleClick
}) => {
  const navigate = useNavigate();
  const { getReadingProgress } = useReadingProgress();

  if (!articles || articles.length === 0) return null;

  const handleArticleClick = (article: Article) => {
    if (onArticleClick) {
      onArticleClick(article);
    } else {
      navigate(`/current-affairs/${article.id}`);
    }
    onClose();
  };

  const getImportanceBadge = (importance: string) => {
    switch (importance) {
      case 'high':
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">High Priority</Badge>;
      case 'medium':
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Medium</Badge>;
      default:
        return <Badge variant="secondary">Normal</Badge>;
    }
  };

  return (
    <Dialog open={!!articles} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-6 border-b bg-gradient-to-r from-primary/5 to-primary/10 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Hash className="h-6 w-6 text-primary" />
            {topicName}
            <Badge variant="secondary" className="ml-2">{articles.length} articles</Badge>
          </DialogTitle>
        </DialogHeader>
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-4">
            {articles.map((article, idx) => {
              const progress = getReadingProgress(article.id);
              return (
                <div 
                  key={article.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() => handleArticleClick(article)}
                >
                  <div className="flex items-start gap-4">
                    <span className="text-2xl font-bold text-primary/30 flex-shrink-0">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getImportanceBadge(article.importance)}
                        <Badge variant="outline">{article.category}</Badge>
                        {article.hasQuiz && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Quiz
                          </Badge>
                        )}
                        {progress >= 100 && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Read
                          </Badge>
                        )}
                      </div>
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                        {article.title}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-2">{article.excerpt}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {article.readTime}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
