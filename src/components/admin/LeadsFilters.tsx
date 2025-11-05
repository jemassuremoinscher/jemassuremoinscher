import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X, Calendar as CalendarIcon } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

export interface FilterOptions {
  searchQuery: string;
  insuranceType: string;
  status: string;
  dateFrom: Date | undefined;
  dateTo: Date | undefined;
}

interface LeadsFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  showInsuranceType?: boolean;
}

export const LeadsFilters = ({ onFilterChange, showInsuranceType = true }: LeadsFiltersProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [insuranceType, setInsuranceType] = useState('all');
  const [status, setStatus] = useState('all');
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();

  const handleFilterChange = () => {
    onFilterChange({
      searchQuery,
      insuranceType,
      status,
      dateFrom,
      dateTo,
    });
  };

  const handleReset = () => {
    setSearchQuery('');
    setInsuranceType('all');
    setStatus('all');
    setDateFrom(undefined);
    setDateTo(undefined);
    onFilterChange({
      searchQuery: '',
      insuranceType: 'all',
      status: 'all',
      dateFrom: undefined,
      dateTo: undefined,
    });
  };

  const hasActiveFilters = searchQuery || insuranceType !== 'all' || status !== 'all' || dateFrom || dateTo;

  return (
    <Card className="p-4 mb-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="h-5 w-5 text-primary" />
        <h3 className="font-semibold">Filtres avancés</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="ml-auto"
          >
            <X className="h-4 w-4 mr-1" />
            Réinitialiser
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher (nom, email, tél...)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              handleFilterChange();
            }}
            className="pl-9"
          />
        </div>

        {/* Insurance Type */}
        {showInsuranceType && (
          <Select value={insuranceType} onValueChange={(value) => {
            setInsuranceType(value);
            handleFilterChange();
          }}>
            <SelectTrigger>
              <SelectValue placeholder="Type d'assurance" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les types</SelectItem>
              <SelectItem value="auto">Auto</SelectItem>
              <SelectItem value="moto">Moto</SelectItem>
              <SelectItem value="habitation">Habitation</SelectItem>
              <SelectItem value="sante">Santé</SelectItem>
              <SelectItem value="pret">Prêt</SelectItem>
              <SelectItem value="animaux">Animaux</SelectItem>
              <SelectItem value="vie">Vie</SelectItem>
              <SelectItem value="prevoyance">Prévoyance</SelectItem>
              <SelectItem value="mrp">MRP</SelectItem>
              <SelectItem value="rcpro">RC Pro</SelectItem>
            </SelectContent>
          </Select>
        )}

        {/* Status */}
        <Select value={status} onValueChange={(value) => {
          setStatus(value);
          handleFilterChange();
        }}>
          <SelectTrigger>
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="contacted">Contacté</SelectItem>
            <SelectItem value="called">Appelé</SelectItem>
            <SelectItem value="converted">Converti</SelectItem>
            <SelectItem value="completed">Terminé</SelectItem>
            <SelectItem value="rejected">Rejeté</SelectItem>
            <SelectItem value="cancelled">Annulé</SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range */}
        <div className="flex gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, 'dd/MM/yy', { locale: fr }) : 'Du'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateFrom}
                onSelect={(date) => {
                  setDateFrom(date);
                  handleFilterChange();
                }}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>

          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex-1 justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, 'dd/MM/yy', { locale: fr }) : 'Au'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={dateTo}
                onSelect={(date) => {
                  setDateTo(date);
                  handleFilterChange();
                }}
                initialFocus
                locale={fr}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </Card>
  );
};
