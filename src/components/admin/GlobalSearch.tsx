import { useState, useEffect } from 'react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Search, FileText, Phone, Mail, User, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: string;
  type: 'quote' | 'callback';
  name: string;
  email: string;
  phone: string;
  insuranceType?: string;
  preferredTime?: string;
  postalCode?: string;
  status: string;
  createdAt: string;
}

interface GlobalSearchProps {
  quotes: any[];
  callbacks: any[];
  onResultClick: (result: SearchResult) => void;
}

export const GlobalSearch = ({ quotes, callbacks, onResultClick }: GlobalSearchProps) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }

    const query = searchQuery.toLowerCase().trim();
    const searchResults: SearchResult[] = [];

    // Search in quotes
    quotes.forEach(quote => {
      const matchName = quote.full_name?.toLowerCase().includes(query);
      const matchEmail = quote.email?.toLowerCase().includes(query);
      const matchPhone = quote.phone?.toLowerCase().includes(query);
      const matchPostalCode = quote.quote_data?.postalCode?.includes(query);

      if (matchName || matchEmail || matchPhone || matchPostalCode) {
        searchResults.push({
          id: quote.id,
          type: 'quote',
          name: quote.full_name,
          email: quote.email,
          phone: quote.phone,
          insuranceType: quote.insurance_type,
          postalCode: quote.quote_data?.postalCode,
          status: quote.status,
          createdAt: quote.created_at,
        });
      }
    });

    // Search in callbacks
    callbacks.forEach(callback => {
      const matchName = callback.full_name?.toLowerCase().includes(query);
      const matchEmail = callback.email?.toLowerCase().includes(query);
      const matchPhone = callback.phone?.toLowerCase().includes(query);

      if (matchName || matchEmail || matchPhone) {
        searchResults.push({
          id: callback.id,
          type: 'callback',
          name: callback.full_name,
          email: callback.email,
          phone: callback.phone,
          preferredTime: callback.preferred_time,
          status: callback.status,
          createdAt: callback.created_at,
        });
      }
    });

    // Sort by most recent first
    searchResults.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    setResults(searchResults.slice(0, 10)); // Limit to 10 results
  }, [searchQuery, quotes, callbacks]);

  const handleResultClick = (result: SearchResult) => {
    onResultClick(result);
    setOpen(false);
    setSearchQuery('');
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      pending: 'bg-orange-100 text-orange-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      called: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    
    return <Badge className={variants[status] || ''}>{status}</Badge>;
  };

  const getTypeLabel = (type: string) => {
    return type === 'quote' ? 'Devis' : 'Rappel';
  };

  const highlightMatch = (text: string, query: string) => {
    const index = text.toLowerCase().indexOf(query.toLowerCase());
    if (index === -1) return text;
    
    return (
      <>
        {text.substring(0, index)}
        <span className="bg-yellow-200 font-semibold">
          {text.substring(index, index + query.length)}
        </span>
        {text.substring(index + query.length)}
      </>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full md:w-96 justify-start text-muted-foreground"
        >
          <Search className="mr-2 h-4 w-4" />
          Rechercher un client (nom, email, téléphone)...
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput 
            placeholder="Tapez au moins 2 caractères..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>
              {searchQuery.length < 2 
                ? 'Tapez au moins 2 caractères pour rechercher' 
                : 'Aucun résultat trouvé'}
            </CommandEmpty>
            
            {results.length > 0 && (
              <CommandGroup heading={`${results.length} résultat${results.length > 1 ? 's' : ''}`}>
                {results.map((result) => (
                  <CommandItem
                    key={result.id}
                    onSelect={() => handleResultClick(result)}
                    className="flex flex-col items-start gap-2 p-3 cursor-pointer"
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        {result.type === 'quote' ? (
                          <FileText className="h-4 w-4 text-blue-600" />
                        ) : (
                          <Phone className="h-4 w-4 text-green-600" />
                        )}
                        <span className="font-medium">
                          {highlightMatch(result.name, searchQuery)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(result.type)}
                        </Badge>
                        {getStatusBadge(result.status)}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-1 text-sm text-muted-foreground w-full">
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3" />
                        <span>{highlightMatch(result.email, searchQuery)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3" />
                        <span>{highlightMatch(result.phone, searchQuery)}</span>
                      </div>
                      {result.insuranceType && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-3 w-3" />
                          <span className="capitalize">{result.insuranceType}</span>
                        </div>
                      )}
                      {result.preferredTime && (
                        <div className="flex items-center gap-2">
                          <User className="h-3 w-3" />
                          <span>{result.preferredTime}</span>
                        </div>
                      )}
                      {result.postalCode && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3" />
                          <span>{highlightMatch(result.postalCode, searchQuery)}</span>
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
