# Archery

Creating a new database user:
```
shell> sudo mysql -u root -p
mysql> GRANT ALL PRIVILEGES ON {database | *}.{table | *} TO '{user}'@'{host | %}' IDENTIFIED BY '{password}';
```

List all users:
```
SELECT user FROM mysql.user GROUP BY user;
```

Delete a user:
```
DELETE FROM mysql.user WHERE user = '{username}';
```
