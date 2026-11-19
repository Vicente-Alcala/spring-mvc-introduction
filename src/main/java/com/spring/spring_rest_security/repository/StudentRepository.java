package com.spring.spring_rest_security.repository;

import com.spring.spring_rest_security.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository interface for
 * performing CRUD and persistence operations
 * on {@link Student} entities.
 */
public interface StudentRepository extends JpaRepository<Student, Long> {
}
