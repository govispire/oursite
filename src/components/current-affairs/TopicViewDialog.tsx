import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Hash, Calendar, Clock, CheckCircle, Volume2, VolumeX, 
  Check, Bookmark, BookmarkCheck, Share2 
} from 'lucide-react';
import { Article } from './types';

interface TopicViewDialogProps {
  articles: Article[] | null;
  topicName: string;
  onClose: () => void;
  getReadingProgress: (articleId: string) => number;
  isNarrating: boolean;
  narrationArticleId: string | null;
  toggleNarration: (article: Article) => void;
  markAsRead: (articleId: string) => void;
  toggleBookmark: (articleId: string) => void;
  isBookmarked: (articleId: string) => boolean;
  setShareArticle: (article: Article) => void;
  getImportanceBadge: (importance: string) => React.ReactNode;
}

export const TopicViewDialog: React.FC<TopicViewDialogProps> = ({
  articles,
  topicName,
  onClose,
  getReadingProgress,
  isNarrating,
  narrationArticleId,
  toggleNarration,
  markAsRead,
  toggleBookmark,
  isBookmarked,
  setShareArticle,
  getImportanceBadge
}) => {
  if (!articles || articles.length === 0) return null;

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
          <div className="p-6 space-y-8">
            {articles.map((article, idx) => {
              const progress = getReadingProgress(article.id);
              const isCurrentlyNarrating = isNarrating && narrationArticleId === article.id;
              return (
                <div 
                  key={article.id}
                  className="pb-8 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <span className="text-3xl font-bold text-primary/30 flex-shrink-0">{idx + 1}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2 flex-wrap">
                        {getImportanceBadge(article.importance)}
                        <Badge variant="outline">{article.category}</Badge>
                        {article.hasQuiz && (
                          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Quiz Available
                          </Badge>
                        )}
                        {progress >= 100 && (
                          <Badge className="bg-primary/10 text-primary border-primary/20">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Read
                          </Badge>
                        )}
                      </div>

                      <h3 className="text-xl font-semibold mb-2">{article.title}</h3>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {article.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {article.readTime}
                        </span>
                      </div>

                      {article.image && (
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="w-full h-48 object-cover rounded-lg mb-4"
                        />
                      )}

                      <div className="prose max-w-none text-sm">
                        {article.content?.split('\n').map((paragraph, pIdx) => (
                          <p key={pIdx} className="mb-3 whitespace-pre-wrap text-muted-foreground">
                            {paragraph}
                          </p>
                        ))}
                      </div>

                      <div className="flex flex-wrap gap-1 mt-4">
                        {article.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 mt-4 pt-4 border-t">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleNarration(article)}
                          className={isCurrentlyNarrating ? 'text-primary border-primary' : ''}
                        >
                          {isCurrentlyNarrating ? (
                            <>
                              <VolumeX className="h-4 w-4 mr-2" />
                              Stop Audio
                            </>
                          ) : (
                            <>
                              <Volume2 className="h-4 w-4 mr-2" />
                              Listen
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markAsRead(article.id)}
                          className={progress >= 100 ? 'text-green-500 border-green-500' : ''}
                        >
                          <Check className="h-4 w-4 mr-2" />
                          {progress >= 100 ? 'Read' : 'Mark as Read'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleBookmark(article.id)}
                        >
                          {isBookmarked(article.id) ? (
                            <BookmarkCheck className="h-4 w-4 mr-2 text-primary" />
                          ) : (
                            <Bookmark className="h-4 w-4 mr-2" />
                          )}
                          {isBookmarked(article.id) ? 'Saved' : 'Save'}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShareArticle(article)}
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          Share
                        </Button>
                      </div>
                    </div>
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
