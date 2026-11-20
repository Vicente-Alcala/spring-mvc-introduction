package com.spring.spring_mvc.repository;

import com.spring.spring_mvc.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Spring Data JPA repository interface for
 * performing CRUD and persistence operations
 * on {@link Student} entities.
 */
public interface StudentRepository extends JpaRepository<Student, Long> {
}
