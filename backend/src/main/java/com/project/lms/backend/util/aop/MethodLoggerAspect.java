package com.project.lms.backend.util.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class MethodLoggerAspect {

    private static final Logger logger = LoggerFactory.getLogger(MethodLoggerAspect.class);

    @Before("execution(* com.project.lms.backend.service.*.*(..)) || execution(* com.project.lms.backend.controller.*.*(..))")
    public void logMethodCall(JoinPoint joinPoint) {
        String className = joinPoint.getTarget().getClass().getSimpleName();
        String methodName = joinPoint.getSignature().getName();
        Object[] args = joinPoint.getArgs();
        logger.info("Called method: {}.{}() with arguments: {}", className, methodName, args);
    }
}
