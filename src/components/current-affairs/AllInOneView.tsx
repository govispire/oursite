import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Download, Share2, Bookmark, Clock, CheckCircle2 } from 'lucide-react';
import { allArticles } from './articlesData';
import { useReadingProgress } from '@/hooks/useReadingProgress';
import { generateTopicPDF } from '@/utils/pdfGenerator';

const AllInOneView = () => {
  const navigate = useNavigate();
  const { getReadingProgress } = useReadingProgress();

  // Group articles by topic
  const articlesByTopic = allArticles.reduce((acc, article) => {
    if (!acc[article.topic]) {
      acc[article.topic] = [];
    }
    acc[article.topic].push(article);
    return acc;
  }, {} as Record<string, typeof allArticles>);

  const topics = Object.keys(articlesByTopic).sort();

  const handleReadAll = (topic: string) => {
    navigate(`/current-affairs/topic/${encodeURIComponent(topic)}`);
  };

  const handleDownloadPDF = (topic: string) => {
    const topicArticles = articlesByTopic[topic];
    generateTopicPDF(topicArticles, topic);
  };

  return (
    <div className="space-y-6">
      {topics.map(topic => {
        const articles = articlesByTopic[topic];
        const readCount = articles.filter(a => getReadingProgress(a.id) >= 100).length;
        
        return (
          <Card key={topic} className="border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <span className="text-primary">#</span> {topic}
                  </CardTitle>
                  <Badge variant="secondary">{articles.length} articles</Badge>
                  {readCount > 0 && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {readCount}/{articles.length} read
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => handleReadAll(topic)}
                    className="gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    Read All ({articles.length})
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleDownloadPDF(topic)}
                  >
                    <Download className="h-4 w-4" />
                    Download PDF
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                {articles.map((article, index) => {
                  const progress = getReadingProgress(article.id);
                  const isRead = progress >= 100;
                  
                  return (
                    <div 
                      key={article.id}
                      className={`flex items-start gap-4 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors ${
                        isRead ? 'bg-green-50/50 border-green-200 dark:bg-green-950/20 dark:border-green-900' : 'bg-muted/30'
                      }`}
                      onClick={() => navigate(`/current-affairs/topic/${encodeURIComponent(topic)}`)}
                    >
                      <span className="text-2xl font-bold text-primary/60 min-w-[24px]">
                        {index + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <Badge 
                            variant={article.importance === 'high' ? 'destructive' : 'secondary'}
                            className="text-xs"
                          >
                            {article.importance === 'high' ? 'High Priority' : article.importance === 'medium' ? 'Medium' : 'Read'}
                          </Badge>
                          {article.hasQuiz && (
                            <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Quiz Available
                            </Badge>
                          )}
                          {isRead && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Read
                            </Badge>
                          )}
                        </div>
                        <h4 className="font-medium text-foreground hover:text-primary line-clamp-1">
                          {article.title}
                        </h4>
                        <p className="text-sm text-muted-foreground line-clamp-1 mt-1">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {article.readTime}
                          </span>
                          <div className="flex gap-1">
                            {article.tags.slice(0, 3).map((tag, i) => (
                              <span key={i} className="text-primary">{tag}</span>
                            ))}
                          </div>
                        </div>
                        {article.relatedIds.length > 0 && (
                          <div className="mt-2">
                            <span className="text-xs text-muted-foreground">Related News: </span>
                            {allArticles
                              .filter(a => article.relatedIds.includes(a.id))
                              .slice(0, 2)
                              .map((related) => (
                                <Button
                                  key={related.id}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 px-2 text-xs"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/current-affairs/${related.id}`);
                                  }}
                                >
                                  {related.title.slice(0, 30)}...
                                </Button>
                              ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Share2 className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Bookmark className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default AllInOneView;
