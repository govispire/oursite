import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Clock, Calendar, BookOpen, Share2, Bookmark, CheckCircle2 } from 'lucide-react';
import { allArticles, getRelatedArticles } from '@/components/current-affairs/articlesData';
import { useReadingProgress } from '@/hooks/useReadingProgress';

const TopicArticlesPage = () => {
  const { topic } = useParams<{ topic: string }>();
  const navigate = useNavigate();
  const { getReadingProgress, markAsRead } = useReadingProgress();
  
  const decodedTopic = decodeURIComponent(topic || '');
  
  // Get all articles for this topic
  const topicArticles = allArticles.filter(
    article => article.topic.toLowerCase() === decodedTopic.toLowerCase()
  );

  if (topicArticles.length === 0) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card>
          <CardContent className="pt-6 text-center">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No Articles Found</h2>
            <p className="text-muted-foreground">No articles found for topic: {decodedTopic}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => navigate(-1)} size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <Badge variant="secondary" className="text-sm">
              {topicArticles.length} Articles
            </Badge>
          </div>
          <div className="mt-3">
            <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">#</span> {decodedTopic}
            </h1>
            <p className="text-muted-foreground mt-1">
              All articles related to {decodedTopic}
            </p>
          </div>
        </div>
      </div>

      {/* Articles List */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-8">
          {topicArticles.map((article, index) => {
            const progress = getReadingProgress(article.id);
            const isRead = progress >= 100;
            
            return (
              <Card 
                key={article.id} 
                className={`overflow-hidden ${isRead ? 'border-green-200 bg-green-50/30 dark:border-green-900 dark:bg-green-950/20' : ''}`}
              >
                <CardContent className="p-0">
                  {/* Article Number */}
                  <div className="bg-primary/10 px-4 py-2 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary">{index + 1}</span>
                      <Badge 
                        variant={article.importance === 'high' ? 'destructive' : article.importance === 'medium' ? 'default' : 'secondary'}
                      >
                        {article.importance === 'high' ? 'High Priority' : article.importance === 'medium' ? 'Medium' : 'Read'}
                      </Badge>
                      {article.hasQuiz && (
                        <Badge variant="outline" className="text-green-600 border-green-600">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Quiz Available
                        </Badge>
                      )}
                    </div>
                    {isRead && (
                      <Badge variant="secondary" className="bg-green-100 text-green-700">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Read
                      </Badge>
                    )}
                  </div>

                  {/* Article Content */}
                  <div className="p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-3">
                      {article.title}
                    </h2>
                    
                    <p className="text-muted-foreground mb-4">{article.excerpt}</p>

                    {/* Meta Info */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {article.readTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {article.date}
                      </div>
                    </div>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {article.tags.map((tag, i) => (
                        <Badge key={i} variant="outline" className="text-xs text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Full Content */}
                    {article.content && (
                      <div className="prose prose-sm dark:prose-invert max-w-none mt-6 pt-6 border-t">
                        {article.content.split('\n\n').map((paragraph, i) => {
                          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <h3 key={i} className="text-lg font-semibold mt-4 mb-2">
                                {paragraph.replace(/\*\*/g, '')}
                              </h3>
                            );
                          }
                          if (paragraph.startsWith('-') || paragraph.startsWith('1.')) {
                            return (
                              <ul key={i} className="list-disc pl-6 space-y-1">
                                {paragraph.split('\n').map((item, j) => (
                                  <li key={j}>{item.replace(/^[-\d.]\s*/, '')}</li>
                                ))}
                              </ul>
                            );
                          }
                          return (
                            <p key={i} className="text-foreground/80 leading-relaxed mb-3">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    )}

                    {/* Related News */}
                    {article.relatedIds.length > 0 && (
                      <div className="mt-6 pt-4 border-t">
                        <p className="text-sm font-medium text-muted-foreground mb-2">Related News:</p>
                        <div className="flex flex-wrap gap-2">
                          {getRelatedArticles(article).slice(0, 3).map(related => (
                            <Button
                              key={related.id}
                              variant="outline"
                              size="sm"
                              className="text-xs"
                              onClick={() => navigate(`/current-affairs/${related.id}`)}
                            >
                              {related.title.slice(0, 35)}...
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 mt-6 pt-4 border-t">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => markAsRead(article.id)}
                        disabled={isRead}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-1" />
                        {isRead ? 'Completed' : 'Mark as Read'}
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm">
                        <Bookmark className="h-4 w-4 mr-1" />
                        Save
                      </Button>
                      {article.hasQuiz && (
                        <Button size="sm" className="ml-auto">
                          Take Quiz ({article.quizQuestions} Q)
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Bottom Navigation */}
        <div className="mt-8 pt-6 border-t text-center">
          <p className="text-muted-foreground mb-4">You've reached the end of {decodedTopic} articles</p>
          <Button onClick={() => navigate('/student/current-affairs')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Current Affairs
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TopicArticlesPage;
