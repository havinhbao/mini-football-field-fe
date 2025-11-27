import { Event } from '@/types';
import eventEmitter from 'mitt';

/**
 * Event bus for communication between components.
 * This is a simple wrapper around mitt to provide a consistent interface.
 * It allows for event-based communication between different parts of the application.
 */
export const eventBus = eventEmitter<Event>();
