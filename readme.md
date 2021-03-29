# Pedestal App API Endpoints

## Users (`/api/users/...`)

### `GET .../`

Retrieve list of all users

### `POST .../signup`

Create new user + log user in

### `POST .../login`

Log user in

## Task Manager (`/api/task_manager/...`)

### `GET .../tasks/:uid`

Retrieve all tasks for that user

### `GET .../tasks/:uid/:date`

Retrieve all tasks from a user under a given date

### `POST .../tasks/:uid`

Post a task for that user

### `DELETE .../tasks/:id`

Delete a task for that user

### `GET .../quotes/:uid`

Retrieve all quotes quote or reflection for that user

### `GET .../quotes/:uid/:date`

Retrieve one quote or reflection for a given date

### `PUT .../quotes/:uid/:date`

Update one quote or reflection

## Cognitive Template (`/api/task_manager/...`)

### `GET .../negative_thoughts/:uid`

Retrieve all negative thoughts for that user

### `GET .../negative_thoughts/:uid/:date`

Retrieve negative thoughts for that user for a given date

### `PUT .../negative_thoughts/:uid/:date`

Update a negative thought for that user

### `GET .../negative_to_positives/:uid`

Retrieve all actions that turn negativity into positivity for that user

### `GET .../negative_to_positives/:uid/:date`

Retrieve actions that turn negativity into positivity for a given date

### `PUT .../negative_to_positives/:uid/:date`

Update one action that turn negativity into positivity

## Mindfulness Template (`/api/task_manager/...`)

### `GET .../struggles/:uid`

Retrieve all struggles for that user

### `GET .../struggles/:uid/:date`

Retrieve a struggle for a given date

### `PUT .../struggles/:uid/:date`

Update a struggle for a given date

### `GET .../proud`

Retrieve all 'proud's

### `GET .../proud/:uid/:date`

Retrieve a 'proud' for a given date

### `PUT .../proud/:uid/:date`

Update a 'proud' for a given date

### `GET .../goal/:uid`

Retrieve all goals for a user

### `GET .../goal/:uid/:date`

Retrieve a goal for a given date

### `PUT .../goal/:uid/:date`

Update a goal for a given date
