export const exportToCSV = (data: any[], filename: string, headers?: string[]) => {
  if (data.length === 0) {
    return;
  }

  // Extract headers from first object if not provided
  const csvHeaders = headers || Object.keys(data[0]);
  
  // Create CSV content
  const csvRows = [
    csvHeaders.join(','), // Header row
    ...data.map(row => 
      csvHeaders.map(header => {
        const value = row[header];
        // Handle special characters and quotes
        const stringValue = String(value ?? '');
        const escapedValue = stringValue.replace(/"/g, '""');
        return `"${escapedValue}"`;
      }).join(',')
    )
  ];

  const csvContent = csvRows.join('\n');
  
  // Create blob and download
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const formatQuotesForExport = (quotes: any[]) => {
  return quotes.map(quote => ({
    'Date': new Date(quote.created_at).toLocaleDateString('fr-FR'),
    'Type': quote.insurance_type,
    'Nom': quote.full_name,
    'Email': quote.email,
    'Téléphone': quote.phone,
    'Code Postal': quote.quote_data?.postalCode || '',
    'Assureur actuel': quote.quote_data?.currentInsurer || '',
    'Statut': quote.status,
  }));
};

export const formatCallbacksForExport = (callbacks: any[]) => {
  return callbacks.map(callback => ({
    'Date': new Date(callback.created_at).toLocaleDateString('fr-FR'),
    'Nom': callback.full_name,
    'Email': callback.email,
    'Téléphone': callback.phone,
    'Créneau préféré': callback.preferred_time,
    'Message': callback.message || '',
    'Statut': callback.status,
  }));
};
