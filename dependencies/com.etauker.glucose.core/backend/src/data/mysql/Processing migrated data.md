# Processing migrated data

1. Exported data from old database
2. In the data file ran the following regex replacements to separate meals from notes column
3. Manually separate the file into A file and B file
 - In B file, run "Remove the already processed lines"
 - In B file, run "Remove double empty lines"
 - In B file, run "Add empty meal field"
 - In A file, manually remove all lines processed in the B file
4. Manually resolve *correction* entries

#### Where notes is empty
From: `'',`  
To : `'', '',`

#### Where notes only contains a meal
From: `'\[(.*?)\]',`  
To: `'$1', '',`

#### Where notes contains a meal and notes
From: `'\[(.*)\] (.*?)',`  
To: `'$1', '$2',`

#### Where notes only contain a note
Cannot be automated using Atom regex. See step 3.

#### Remove the already processed lines
From: `.*, '.*?', '.*?',.*`  
To:

#### Remove double empty lines
From: `\n\n`  
To: `\n`

#### Add empty meal field
From: `\(('(.*?)', .*, )'(.*)?('.*)`
To: `($1'', '$3$4`
